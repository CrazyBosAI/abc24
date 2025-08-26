import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { router } from 'expo-router';
import { commonStyles, colors } from '../../styles/commonStyles';
import Icon from '../../components/Icon';
import { DrawerActions } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';

interface Trade {
  id: string;
  botName: string;
  pair: string;
  type: 'buy' | 'sell';
  amount: number;
  price: number;
  total: number;
  profit?: number;
  profitPercent?: number;
  status: 'completed' | 'pending' | 'cancelled';
  date: string;
  fee: number;
}

export default function TradesScreen() {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'completed' | 'pending' | 'cancelled'>('all');
  const [filterType, setFilterType] = useState<'all' | 'buy' | 'sell'>('all');

  const [trades, setTrades] = useState<Trade[]>([
    {
      id: '1',
      botName: 'BTC Long Bot',
      pair: 'BTC/USDT',
      type: 'buy',
      amount: 0.05,
      price: 42800.00,
      total: 2140.00,
      profit: 125.50,
      profitPercent: 5.86,
      status: 'completed',
      date: '2024-01-20T10:30:00Z',
      fee: 2.14,
    },
    {
      id: '2',
      botName: 'ETH DCA Bot',
      pair: 'ETH/USDT',
      type: 'sell',
      amount: 0.1,
      price: 2680.00,
      total: 268.00,
      profit: -15.20,
      profitPercent: -5.37,
      status: 'completed',
      date: '2024-01-19T15:45:00Z',
      fee: 0.27,
    },
    {
      id: '3',
      botName: 'ADA Grid Bot',
      pair: 'ADA/USDT',
      type: 'buy',
      amount: 1000,
      price: 0.52,
      total: 520.00,
      status: 'pending',
      date: '2024-01-20T16:20:00Z',
      fee: 0.52,
    },
    {
      id: '4',
      botName: 'SOL Short Bot',
      pair: 'SOL/USDT',
      type: 'sell',
      amount: 5,
      price: 98.50,
      total: 492.50,
      profit: 45.75,
      profitPercent: 10.24,
      status: 'completed',
      date: '2024-01-18T11:10:00Z',
      fee: 0.49,
    },
    {
      id: '5',
      botName: 'BTC Long Bot',
      pair: 'BTC/USDT',
      type: 'buy',
      amount: 0.02,
      price: 43100.00,
      total: 862.00,
      status: 'cancelled',
      date: '2024-01-17T09:30:00Z',
      fee: 0,
    },
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return colors.success;
      case 'pending':
        return colors.warning;
      case 'cancelled':
        return colors.danger;
      default:
        return colors.textSecondary;
    }
  };

  const getProfitColor = (profit?: number) => {
    if (profit === undefined) return colors.textSecondary;
    return profit >= 0 ? colors.success : colors.danger;
  };

  const filteredTrades = trades.filter(trade => {
    const matchesSearch = trade.botName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         trade.pair.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || trade.status === filterStatus;
    const matchesType = filterType === 'all' || trade.type === filterType;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const totalProfit = trades
    .filter(trade => trade.profit !== undefined)
    .reduce((sum, trade) => sum + (trade.profit || 0), 0);

  const totalVolume = trades
    .filter(trade => trade.status === 'completed')
    .reduce((sum, trade) => sum + trade.total, 0);

  return (
    <View style={commonStyles.container}>
      <View style={commonStyles.header}>
        <View style={commonStyles.row}>
          <TouchableOpacity onPress={() => navigation.dispatch(DrawerActions.openDrawer())}>
            <Icon name="menu" size={24} style={{ color: colors.text }} />
          </TouchableOpacity>
          <Text style={commonStyles.headerTitle}>Trades</Text>
          <TouchableOpacity onPress={() => console.log('Export trades')}>
            <Icon name="download" size={24} style={{ color: colors.text }} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={commonStyles.content}>
        {/* Trade Statistics */}
        <View style={commonStyles.card}>
          <Text style={[commonStyles.subtitle, commonStyles.mb16]}>Trade Statistics</Text>
          
          <View style={[commonStyles.row, commonStyles.mb8]}>
            <Text style={commonStyles.textSecondary}>Total Trades</Text>
            <Text style={[commonStyles.text, { fontWeight: '600' }]}>
              {trades.length}
            </Text>
          </View>

          <View style={[commonStyles.row, commonStyles.mb8]}>
            <Text style={commonStyles.textSecondary}>Total Volume</Text>
            <Text style={[commonStyles.text, { fontWeight: '600' }]}>
              ${totalVolume.toLocaleString()}
            </Text>
          </View>

          <View style={[commonStyles.row, commonStyles.mb8]}>
            <Text style={commonStyles.textSecondary}>Total Profit</Text>
            <Text style={[commonStyles.text, { color: getProfitColor(totalProfit), fontWeight: '600' }]}>
              ${totalProfit.toFixed(2)}
            </Text>
          </View>

          <View style={commonStyles.row}>
            <Text style={commonStyles.textSecondary}>Completed</Text>
            <Text style={[commonStyles.text, { fontWeight: '600', color: colors.success }]}>
              {trades.filter(t => t.status === 'completed').length}
            </Text>
          </View>
        </View>

        {/* Search and Filters */}
        <View style={[commonStyles.card, { marginBottom: 16 }]}>
          <View style={[commonStyles.row, { marginBottom: 16 }]}>
            <View style={[commonStyles.flex1, { marginRight: 12 }]}>
              <TextInput
                style={commonStyles.input}
                placeholder="Search trades..."
                placeholderTextColor={colors.textSecondary}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>
          </View>

          {/* Filter Buttons */}
          <View style={{ marginBottom: 12 }}>
            <Text style={[commonStyles.textSecondary, { marginBottom: 8 }]}>Status</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {['all', 'completed', 'pending', 'cancelled'].map((status) => (
                <TouchableOpacity
                  key={status}
                  style={[
                    {
                      backgroundColor: filterStatus === status ? colors.accent : colors.secondary,
                      paddingHorizontal: 16,
                      paddingVertical: 8,
                      borderRadius: 20,
                      marginRight: 8,
                    }
                  ]}
                  onPress={() => setFilterStatus(status as any)}
                >
                  <Text style={[
                    commonStyles.textSecondary,
                    {
                      color: filterStatus === status ? colors.text : colors.textSecondary,
                      textTransform: 'capitalize',
                    }
                  ]}>
                    {status}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <View>
            <Text style={[commonStyles.textSecondary, { marginBottom: 8 }]}>Type</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {['all', 'buy', 'sell'].map((type) => (
                <TouchableOpacity
                  key={type}
                  style={[
                    {
                      backgroundColor: filterType === type ? colors.accent : colors.secondary,
                      paddingHorizontal: 16,
                      paddingVertical: 8,
                      borderRadius: 20,
                      marginRight: 8,
                    }
                  ]}
                  onPress={() => setFilterType(type as any)}
                >
                  <Text style={[
                    commonStyles.textSecondary,
                    {
                      color: filterType === type ? colors.text : colors.textSecondary,
                      textTransform: 'capitalize',
                    }
                  ]}>
                    {type}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>

        {/* Trades List */}
        {filteredTrades.length === 0 ? (
          <View style={[commonStyles.card, { alignItems: 'center', padding: 40 }]}>
            <Icon name="bar-chart" size={48} style={{ color: colors.textSecondary, marginBottom: 16 }} />
            <Text style={[commonStyles.text, { marginBottom: 8 }]}>No trades found</Text>
            <Text style={[commonStyles.textSecondary, { textAlign: 'center' }]}>
              {searchQuery || filterStatus !== 'all' || filterType !== 'all' 
                ? 'Try adjusting your search or filters'
                : 'Your trades will appear here once your bots start trading'
              }
            </Text>
          </View>
        ) : (
          filteredTrades.map((trade) => (
            <TouchableOpacity
              key={trade.id}
              style={[
                commonStyles.card,
                {
                  borderLeftWidth: 4,
                  borderLeftColor: getStatusColor(trade.status),
                }
              ]}
              onPress={() => console.log(`Viewing trade ${trade.id}`)}
            >
              <View style={[commonStyles.row, commonStyles.mb8]}>
                <View style={commonStyles.flex1}>
                  <View style={[commonStyles.rowCenter, { marginBottom: 4 }]}>
                    <View style={[
                      {
                        backgroundColor: trade.type === 'buy' ? colors.success : colors.danger,
                        paddingHorizontal: 6,
                        paddingVertical: 2,
                        borderRadius: 4,
                        marginRight: 8,
                      }
                    ]}>
                      <Text style={[commonStyles.textSecondary, { fontSize: 10, color: colors.text }]}>
                        {trade.type.toUpperCase()}
                      </Text>
                    </View>
                    <Text style={[commonStyles.text, { fontWeight: '600' }]}>
                      {trade.pair}
                    </Text>
                  </View>
                  <Text style={commonStyles.textSecondary}>{trade.botName}</Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={[commonStyles.text, { fontWeight: '600' }]}>
                    ${trade.total.toLocaleString()}
                  </Text>
                  {trade.profit !== undefined && (
                    <Text style={[commonStyles.textSecondary, { color: getProfitColor(trade.profit) }]}>
                      {trade.profit > 0 ? '+' : ''}${trade.profit.toFixed(2)} ({trade.profitPercent?.toFixed(2)}%)
                    </Text>
                  )}
                </View>
              </View>

              <View style={[commonStyles.row, commonStyles.mb8]}>
                <Text style={commonStyles.textSecondary}>
                  {trade.amount} @ ${trade.price.toLocaleString()}
                </Text>
                <View style={commonStyles.rowCenter}>
                  <View style={[
                    {
                      width: 8,
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: getStatusColor(trade.status),
                      marginRight: 6,
                    }
                  ]} />
                  <Text style={[commonStyles.textSecondary, { textTransform: 'capitalize' }]}>
                    {trade.status}
                  </Text>
                </View>
              </View>

              <View style={commonStyles.row}>
                <Text style={[commonStyles.textSecondary, { fontSize: 12 }]}>
                  {new Date(trade.date).toLocaleDateString()} {new Date(trade.date).toLocaleTimeString()}
                </Text>
                <Text style={[commonStyles.textSecondary, { fontSize: 12 }]}>
                  Fee: ${trade.fee.toFixed(2)}
                </Text>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </View>
  );
}