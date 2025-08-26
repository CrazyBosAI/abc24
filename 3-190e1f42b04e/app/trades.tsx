import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { router } from 'expo-router';
import { commonStyles, colors } from '../styles/commonStyles';
import Icon from '../components/Icon';

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
}

export default function TradesScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'completed' | 'pending'>('all');
  
  const [trades] = useState<Trade[]>([
    {
      id: '1',
      botName: 'BTC Long Bot',
      pair: 'BTC/USDT',
      type: 'buy',
      amount: 0.1,
      price: 42000.00,
      total: 4200.00,
      status: 'completed',
      date: '2024-01-15 14:30:25',
    },
    {
      id: '2',
      botName: 'BTC Long Bot',
      pair: 'BTC/USDT',
      type: 'sell',
      amount: 0.1,
      price: 43500.00,
      total: 4350.00,
      profit: 150.00,
      profitPercent: 3.57,
      status: 'completed',
      date: '2024-01-15 16:45:12',
    },
    {
      id: '3',
      botName: 'ETH DCA Bot',
      pair: 'ETH/USDT',
      type: 'buy',
      amount: 1.5,
      price: 2650.00,
      total: 3975.00,
      status: 'pending',
      date: '2024-01-15 17:20:08',
    },
    {
      id: '4',
      botName: 'ADA Grid Bot',
      pair: 'ADA/USDT',
      type: 'sell',
      amount: 1000,
      price: 0.46,
      total: 460.00,
      profit: 20.00,
      profitPercent: 4.55,
      status: 'completed',
      date: '2024-01-14 11:15:33',
    },
    {
      id: '5',
      botName: 'SOL Short Bot',
      pair: 'SOL/USDT',
      type: 'sell',
      amount: 5,
      price: 98.50,
      total: 492.50,
      status: 'cancelled',
      date: '2024-01-14 09:30:45',
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
    const matchesFilter = filterStatus === 'all' || trade.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const totalProfit = trades
    .filter(trade => trade.profit !== undefined)
    .reduce((sum, trade) => sum + (trade.profit || 0), 0);

  const completedTrades = trades.filter(trade => trade.status === 'completed').length;
  const pendingTrades = trades.filter(trade => trade.status === 'pending').length;

  return (
    <View style={commonStyles.container}>
      <View style={commonStyles.header}>
        <View style={commonStyles.row}>
          <TouchableOpacity onPress={() => router.back()}>
            <Icon name="arrow-back" size={24} style={{ color: colors.text }} />
          </TouchableOpacity>
          <Text style={commonStyles.headerTitle}>Trades</Text>
          <TouchableOpacity>
            <Icon name="filter" size={24} style={{ color: colors.text }} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={commonStyles.content}>
        {/* Trade Stats */}
        <View style={commonStyles.card}>
          <Text style={[commonStyles.subtitle, commonStyles.mb16]}>Trading Overview</Text>
          
          <View style={[commonStyles.row, commonStyles.mb8]}>
            <Text style={commonStyles.textSecondary}>Total Profit</Text>
            <Text style={[commonStyles.text, { color: getProfitColor(totalProfit), fontWeight: '600' }]}>
              ${totalProfit.toFixed(2)}
            </Text>
          </View>

          <View style={[commonStyles.row, commonStyles.mb8]}>
            <Text style={commonStyles.textSecondary}>Completed Trades</Text>
            <Text style={[commonStyles.text, { fontWeight: '600' }]}>
              {completedTrades}
            </Text>
          </View>

          <View style={commonStyles.row}>
            <Text style={commonStyles.textSecondary}>Pending Trades</Text>
            <Text style={[commonStyles.text, { fontWeight: '600', color: colors.warning }]}>
              {pendingTrades}
            </Text>
          </View>
        </View>

        {/* Search and Filter */}
        <View style={commonStyles.card}>
          <TextInput
            style={[commonStyles.input, commonStyles.mb16]}
            placeholder="Search trades..."
            placeholderTextColor={colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          
          <View style={commonStyles.row}>
            <TouchableOpacity
              style={[
                {
                  paddingVertical: 8,
                  paddingHorizontal: 16,
                  borderRadius: 20,
                  backgroundColor: filterStatus === 'all' ? colors.accent : colors.secondary,
                  marginRight: 8,
                }
              ]}
              onPress={() => setFilterStatus('all')}
            >
              <Text style={[commonStyles.textSecondary, filterStatus === 'all' && { color: colors.text }]}>
                All
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                {
                  paddingVertical: 8,
                  paddingHorizontal: 16,
                  borderRadius: 20,
                  backgroundColor: filterStatus === 'completed' ? colors.accent : colors.secondary,
                  marginRight: 8,
                }
              ]}
              onPress={() => setFilterStatus('completed')}
            >
              <Text style={[commonStyles.textSecondary, filterStatus === 'completed' && { color: colors.text }]}>
                Completed
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                {
                  paddingVertical: 8,
                  paddingHorizontal: 16,
                  borderRadius: 20,
                  backgroundColor: filterStatus === 'pending' ? colors.accent : colors.secondary,
                }
              ]}
              onPress={() => setFilterStatus('pending')}
            >
              <Text style={[commonStyles.textSecondary, filterStatus === 'pending' && { color: colors.text }]}>
                Pending
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Trades List */}
        <ScrollView showsVerticalScrollIndicator={false}>
          {filteredTrades.map((trade) => (
            <TouchableOpacity key={trade.id} style={commonStyles.card}>
              <View style={[commonStyles.row, commonStyles.mb8]}>
                <View style={commonStyles.flex1}>
                  <View style={commonStyles.rowCenter}>
                    <View style={[
                      {
                        width: 32,
                        height: 32,
                        borderRadius: 16,
                        backgroundColor: trade.type === 'buy' ? colors.success : colors.danger,
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginRight: 12,
                      }
                    ]}>
                      <Icon 
                        name={trade.type === 'buy' ? 'arrow-down' : 'arrow-up'} 
                        size={16} 
                        style={{ color: colors.text }} 
                      />
                    </View>
                    <View>
                      <Text style={[commonStyles.text, { fontWeight: '600', textTransform: 'uppercase' }]}>
                        {trade.type} {trade.pair}
                      </Text>
                      <Text style={commonStyles.textSecondary}>
                        {trade.botName}
                      </Text>
                    </View>
                  </View>
                </View>
                
                <View style={{ alignItems: 'flex-end' }}>
                  <View style={[
                    {
                      paddingVertical: 4,
                      paddingHorizontal: 8,
                      borderRadius: 12,
                      backgroundColor: getStatusColor(trade.status),
                    }
                  ]}>
                    <Text style={[{ fontSize: 10, color: colors.text, fontWeight: '600', textTransform: 'capitalize' }]}>
                      {trade.status}
                    </Text>
                  </View>
                </View>
              </View>

              <View style={[commonStyles.row, commonStyles.mb8]}>
                <Text style={commonStyles.textSecondary}>
                  Amount: {trade.amount} @ ${trade.price.toLocaleString()}
                </Text>
                <Text style={[commonStyles.text, { fontWeight: '600' }]}>
                  ${trade.total.toLocaleString()}
                </Text>
              </View>

              {trade.profit !== undefined && (
                <View style={[commonStyles.row, commonStyles.mb8]}>
                  <Text style={commonStyles.textSecondary}>Profit</Text>
                  <View style={{ alignItems: 'flex-end' }}>
                    <Text style={[commonStyles.text, { color: getProfitColor(trade.profit), fontWeight: '600' }]}>
                      ${trade.profit.toFixed(2)}
                    </Text>
                    <Text style={[commonStyles.textSecondary, { color: getProfitColor(trade.profit) }]}>
                      ({trade.profitPercent && trade.profitPercent > 0 ? '+' : ''}{trade.profitPercent?.toFixed(2)}%)
                    </Text>
                  </View>
                </View>
              )}

              <View style={commonStyles.row}>
                <Text style={[commonStyles.textSecondary, { fontSize: 12 }]}>
                  {trade.date}
                </Text>
                <Icon name="chevron-forward" size={16} style={{ color: colors.textSecondary }} />
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </View>
  );
}