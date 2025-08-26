import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { commonStyles, colors } from '../../../styles/commonStyles';
import Icon from '../../../components/Icon';
import Button from '../../../components/Button';

interface BotDetails {
  id: string;
  name: string;
  pair: string;
  type: 'DCA' | 'Grid' | 'Long' | 'Short';
  profit: number;
  profitPercent: number;
  status: 'active' | 'inactive' | 'error';
  trades: number;
  created: string;
  baseOrderSize: number;
  safetyOrderSize: number;
  maxSafetyTrades: number;
  takeProfit: number;
  stopLoss?: number;
  currentPrice: number;
  averagePrice: number;
  totalInvested: number;
  unrealizedPnL: number;
}

interface Trade {
  id: string;
  type: 'buy' | 'sell';
  amount: number;
  price: number;
  total: number;
  date: string;
  status: 'completed' | 'pending';
}

export default function BotDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  
  // Mock data - in real app, fetch based on id
  const [botDetails, setBotDetails] = useState<BotDetails>({
    id: id || '1',
    name: 'BTC Long Bot',
    pair: 'BTC/USDT',
    type: 'Long',
    profit: 234.56,
    profitPercent: 5.67,
    status: 'active',
    trades: 23,
    created: '2024-01-15',
    baseOrderSize: 100,
    safetyOrderSize: 200,
    maxSafetyTrades: 5,
    takeProfit: 2.5,
    stopLoss: 5.0,
    currentPrice: 43250.00,
    averagePrice: 42800.00,
    totalInvested: 2140.00,
    unrealizedPnL: 125.50,
  });

  const [recentTrades, setRecentTrades] = useState<Trade[]>([
    {
      id: '1',
      type: 'buy',
      amount: 0.05,
      price: 42800.00,
      total: 2140.00,
      date: '2024-01-20T10:30:00Z',
      status: 'completed',
    },
    {
      id: '2',
      type: 'buy',
      amount: 0.02,
      price: 42500.00,
      total: 850.00,
      date: '2024-01-19T15:45:00Z',
      status: 'completed',
    },
    {
      id: '3',
      type: 'buy',
      amount: 0.03,
      price: 42200.00,
      total: 1266.00,
      date: '2024-01-18T09:15:00Z',
      status: 'completed',
    },
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return colors.success;
      case 'inactive':
        return colors.textSecondary;
      case 'error':
        return colors.danger;
      default:
        return colors.textSecondary;
    }
  };

  const getProfitColor = (profit: number) => {
    return profit >= 0 ? colors.success : colors.danger;
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'DCA':
        return colors.accentBlue;
      case 'Grid':
        return colors.warning;
      case 'Long':
        return colors.success;
      case 'Short':
        return colors.danger;
      default:
        return colors.textSecondary;
    }
  };

  const toggleBotStatus = () => {
    const newStatus = botDetails.status === 'active' ? 'inactive' : 'active';
    setBotDetails(prev => ({ ...prev, status: newStatus as any }));
    console.log(`Bot ${botDetails.id} status changed to ${newStatus}`);
  };

  const deleteBot = () => {
    Alert.alert(
      'Delete Bot',
      `Are you sure you want to delete "${botDetails.name}"? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            console.log(`Deleting bot ${botDetails.id}`);
            router.back();
          },
        },
      ]
    );
  };

  return (
    <View style={commonStyles.container}>
      <View style={commonStyles.header}>
        <View style={commonStyles.row}>
          <TouchableOpacity onPress={() => router.back()}>
            <Icon name="arrow-back" size={24} style={{ color: colors.text }} />
          </TouchableOpacity>
          <Text style={commonStyles.headerTitle}>{botDetails.name}</Text>
          <TouchableOpacity onPress={() => console.log('Edit bot')}>
            <Icon name="create" size={24} style={{ color: colors.text }} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={commonStyles.content}>
        {/* Bot Status Card */}
        <View style={[
          commonStyles.card,
          {
            borderLeftWidth: 4,
            borderLeftColor: getStatusColor(botDetails.status),
          }
        ]}>
          <View style={[commonStyles.row, commonStyles.mb16]}>
            <View style={commonStyles.flex1}>
              <View style={[commonStyles.rowCenter, { marginBottom: 8 }]}>
                <View style={[
                  {
                    backgroundColor: getTypeColor(botDetails.type),
                    paddingHorizontal: 8,
                    paddingVertical: 4,
                    borderRadius: 6,
                    marginRight: 12,
                  }
                ]}>
                  <Text style={[commonStyles.textSecondary, { color: colors.text, fontSize: 12 }]}>
                    {botDetails.type}
                  </Text>
                </View>
                <Text style={[commonStyles.text, { fontSize: 18, fontWeight: '600' }]}>
                  {botDetails.pair}
                </Text>
              </View>
              <View style={commonStyles.rowCenter}>
                <View style={[
                  {
                    width: 8,
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: getStatusColor(botDetails.status),
                    marginRight: 6,
                  }
                ]} />
                <Text style={[commonStyles.textSecondary, { textTransform: 'capitalize' }]}>
                  {botDetails.status}
                </Text>
              </View>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={[commonStyles.text, { color: getProfitColor(botDetails.profit), fontWeight: '700', fontSize: 18 }]}>
                ${botDetails.profit.toFixed(2)}
              </Text>
              <Text style={[commonStyles.textSecondary, { color: getProfitColor(botDetails.profit) }]}>
                ({botDetails.profitPercent > 0 ? '+' : ''}{botDetails.profitPercent.toFixed(2)}%)
              </Text>
            </View>
          </View>

          <View style={[commonStyles.row, { marginTop: 16 }]}>
            <Button
              text={botDetails.status === 'active' ? 'Stop Bot' : 'Start Bot'}
              onPress={toggleBotStatus}
              style={[
                {
                  backgroundColor: botDetails.status === 'active' ? colors.danger : colors.success,
                  flex: 1,
                  marginRight: 8,
                }
              ]}
            />
            <Button
              text="Delete"
              onPress={deleteBot}
              style={[
                {
                  backgroundColor: colors.secondary,
                  borderWidth: 1,
                  borderColor: colors.danger,
                  flex: 1,
                  marginLeft: 8,
                }
              ]}
              textStyle={{ color: colors.danger }}
            />
          </View>
        </View>

        {/* Performance Metrics */}
        <View style={commonStyles.card}>
          <Text style={[commonStyles.subtitle, commonStyles.mb16]}>Performance</Text>
          
          <View style={[commonStyles.row, commonStyles.mb8]}>
            <Text style={commonStyles.textSecondary}>Total Trades</Text>
            <Text style={[commonStyles.text, { fontWeight: '600' }]}>
              {botDetails.trades}
            </Text>
          </View>

          <View style={[commonStyles.row, commonStyles.mb8]}>
            <Text style={commonStyles.textSecondary}>Total Invested</Text>
            <Text style={[commonStyles.text, { fontWeight: '600' }]}>
              ${botDetails.totalInvested.toLocaleString()}
            </Text>
          </View>

          <View style={[commonStyles.row, commonStyles.mb8]}>
            <Text style={commonStyles.textSecondary}>Unrealized P&L</Text>
            <Text style={[commonStyles.text, { color: getProfitColor(botDetails.unrealizedPnL), fontWeight: '600' }]}>
              ${botDetails.unrealizedPnL.toFixed(2)}
            </Text>
          </View>

          <View style={[commonStyles.row, commonStyles.mb8]}>
            <Text style={commonStyles.textSecondary}>Average Price</Text>
            <Text style={[commonStyles.text, { fontWeight: '600' }]}>
              ${botDetails.averagePrice.toLocaleString()}
            </Text>
          </View>

          <View style={commonStyles.row}>
            <Text style={commonStyles.textSecondary}>Current Price</Text>
            <Text style={[commonStyles.text, { fontWeight: '600' }]}>
              ${botDetails.currentPrice.toLocaleString()}
            </Text>
          </View>
        </View>

        {/* Bot Configuration */}
        <View style={commonStyles.card}>
          <Text style={[commonStyles.subtitle, commonStyles.mb16]}>Configuration</Text>
          
          <View style={[commonStyles.row, commonStyles.mb8]}>
            <Text style={commonStyles.textSecondary}>Base Order Size</Text>
            <Text style={[commonStyles.text, { fontWeight: '600' }]}>
              ${botDetails.baseOrderSize}
            </Text>
          </View>

          <View style={[commonStyles.row, commonStyles.mb8]}>
            <Text style={commonStyles.textSecondary}>Safety Order Size</Text>
            <Text style={[commonStyles.text, { fontWeight: '600' }]}>
              ${botDetails.safetyOrderSize}
            </Text>
          </View>

          <View style={[commonStyles.row, commonStyles.mb8]}>
            <Text style={commonStyles.textSecondary}>Max Safety Trades</Text>
            <Text style={[commonStyles.text, { fontWeight: '600' }]}>
              {botDetails.maxSafetyTrades}
            </Text>
          </View>

          <View style={[commonStyles.row, commonStyles.mb8]}>
            <Text style={commonStyles.textSecondary}>Take Profit</Text>
            <Text style={[commonStyles.text, { fontWeight: '600', color: colors.success }]}>
              {botDetails.takeProfit}%
            </Text>
          </View>

          {botDetails.stopLoss && (
            <View style={commonStyles.row}>
              <Text style={commonStyles.textSecondary}>Stop Loss</Text>
              <Text style={[commonStyles.text, { fontWeight: '600', color: colors.danger }]}>
                {botDetails.stopLoss}%
              </Text>
            </View>
          )}
        </View>

        {/* Recent Trades */}
        <View style={commonStyles.card}>
          <View style={[commonStyles.row, commonStyles.mb16]}>
            <Text style={commonStyles.subtitle}>Recent Trades</Text>
            <TouchableOpacity onPress={() => router.push('/(main)/trades')}>
              <Text style={[commonStyles.textSecondary, { color: colors.accent }]}>View All</Text>
            </TouchableOpacity>
          </View>

          {recentTrades.map((trade) => (
            <View
              key={trade.id}
              style={[
                {
                  backgroundColor: colors.secondary,
                  borderRadius: 8,
                  padding: 12,
                  marginBottom: 8,
                  borderLeftWidth: 4,
                  borderLeftColor: trade.type === 'buy' ? colors.success : colors.danger,
                }
              ]}
            >
              <View style={[commonStyles.row, commonStyles.mb4]}>
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
                      {trade.amount} {botDetails.pair.split('/')[0]}
                    </Text>
                  </View>
                  <Text style={[commonStyles.textSecondary, { fontSize: 12 }]}>
                    {new Date(trade.date).toLocaleDateString()} {new Date(trade.date).toLocaleTimeString()}
                  </Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={[commonStyles.text, { fontWeight: '600' }]}>
                    ${trade.total.toLocaleString()}
                  </Text>
                  <Text style={commonStyles.textSecondary}>
                    @ ${trade.price.toLocaleString()}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Bot Info */}
        <View style={commonStyles.card}>
          <Text style={[commonStyles.subtitle, commonStyles.mb16]}>Bot Information</Text>
          
          <View style={[commonStyles.row, commonStyles.mb8]}>
            <Text style={commonStyles.textSecondary}>Created</Text>
            <Text style={[commonStyles.text, { fontWeight: '600' }]}>
              {new Date(botDetails.created).toLocaleDateString()}
            </Text>
          </View>

          <View style={[commonStyles.row, commonStyles.mb8]}>
            <Text style={commonStyles.textSecondary}>Bot ID</Text>
            <Text style={[commonStyles.text, { fontWeight: '600', fontFamily: 'monospace' }]}>
              {botDetails.id}
            </Text>
          </View>

          <View style={commonStyles.row}>
            <Text style={commonStyles.textSecondary}>Last Updated</Text>
            <Text style={[commonStyles.text, { fontWeight: '600' }]}>
              {new Date().toLocaleDateString()}
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}