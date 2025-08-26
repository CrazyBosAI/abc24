import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { router } from 'expo-router';
import { commonStyles, colors } from '../../styles/commonStyles';
import Icon from '../../components/Icon';
import { DrawerActions } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';

interface Holding {
  symbol: string;
  name: string;
  amount: number;
  value: number;
  price: number;
  change24h: number;
  allocation: number;
}

interface Transaction {
  id: string;
  type: 'buy' | 'sell';
  symbol: string;
  amount: number;
  price: number;
  total: number;
  date: string;
}

export default function PortfolioScreen() {
  const navigation = useNavigation();
  const [selectedTab, setSelectedTab] = useState<'holdings' | 'transactions'>('holdings');
  
  const [portfolioStats, setPortfolioStats] = useState({
    totalValue: 12543.67,
    totalPnL: 1234.56,
    totalPnLPercent: 10.92,
    todayChange: 45.23,
    todayChangePercent: 0.36,
  });

  const [holdings, setHoldings] = useState<Holding[]>([
    {
      symbol: 'BTC',
      name: 'Bitcoin',
      amount: 0.25,
      value: 10812.50,
      price: 43250.00,
      change24h: 2.98,
      allocation: 86.2,
    },
    {
      symbol: 'ETH',
      name: 'Ethereum',
      amount: 0.65,
      value: 1723.00,
      price: 2650.75,
      change24h: -1.68,
      allocation: 13.7,
    },
    {
      symbol: 'USDT',
      name: 'Tether',
      amount: 8.17,
      value: 8.17,
      price: 1.00,
      change24h: 0.01,
      allocation: 0.1,
    },
  ]);

  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: '1',
      type: 'buy',
      symbol: 'BTC',
      amount: 0.05,
      price: 42800.00,
      total: 2140.00,
      date: '2024-01-20T10:30:00Z',
    },
    {
      id: '2',
      type: 'sell',
      symbol: 'ETH',
      amount: 0.1,
      price: 2680.00,
      total: 268.00,
      date: '2024-01-19T15:45:00Z',
    },
    {
      id: '3',
      type: 'buy',
      symbol: 'ETH',
      amount: 0.2,
      price: 2620.00,
      total: 524.00,
      date: '2024-01-18T09:15:00Z',
    },
    {
      id: '4',
      type: 'buy',
      symbol: 'BTC',
      amount: 0.1,
      price: 41500.00,
      total: 4150.00,
      date: '2024-01-17T14:20:00Z',
    },
  ]);

  const getProfitColor = (value: number) => {
    return value >= 0 ? colors.success : colors.danger;
  };

  const renderHoldings = () => (
    <View>
      {holdings.map((holding) => (
        <TouchableOpacity
          key={holding.symbol}
          style={[
            commonStyles.card,
            { borderLeftWidth: 4, borderLeftColor: colors.accent }
          ]}
          onPress={() => console.log(`Viewing ${holding.symbol} details`)}
        >
          <View style={[commonStyles.row, commonStyles.mb8]}>
            <View style={commonStyles.flex1}>
              <Text style={[commonStyles.text, { fontWeight: '600', marginBottom: 4 }]}>
                {holding.symbol}
              </Text>
              <Text style={commonStyles.textSecondary}>{holding.name}</Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={[commonStyles.text, { fontWeight: '600' }]}>
                ${holding.value.toLocaleString()}
              </Text>
              <Text style={[commonStyles.textSecondary, { color: getProfitColor(holding.change24h) }]}>
                {holding.change24h > 0 ? '+' : ''}{holding.change24h.toFixed(2)}%
              </Text>
            </View>
          </View>

          <View style={[commonStyles.row, commonStyles.mb8]}>
            <Text style={commonStyles.textSecondary}>
              {holding.amount} {holding.symbol}
            </Text>
            <Text style={commonStyles.textSecondary}>
              ${holding.price.toLocaleString()}
            </Text>
          </View>

          <View style={[commonStyles.row, { alignItems: 'center' }]}>
            <View style={[commonStyles.flex1, { marginRight: 12 }]}>
              <View style={[
                {
                  height: 6,
                  backgroundColor: colors.secondary,
                  borderRadius: 3,
                  overflow: 'hidden',
                }
              ]}>
                <View style={[
                  {
                    height: '100%',
                    width: `${holding.allocation}%`,
                    backgroundColor: colors.accent,
                  }
                ]} />
              </View>
            </View>
            <Text style={[commonStyles.textSecondary, { fontSize: 12 }]}>
              {holding.allocation.toFixed(1)}%
            </Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderTransactions = () => (
    <View>
      {transactions.map((transaction) => (
        <View
          key={transaction.id}
          style={[
            commonStyles.card,
            {
              borderLeftWidth: 4,
              borderLeftColor: transaction.type === 'buy' ? colors.success : colors.danger,
            }
          ]}
        >
          <View style={[commonStyles.row, commonStyles.mb8]}>
            <View style={commonStyles.flex1}>
              <View style={[commonStyles.rowCenter, { marginBottom: 4 }]}>
                <View style={[
                  {
                    backgroundColor: transaction.type === 'buy' ? colors.success : colors.danger,
                    paddingHorizontal: 8,
                    paddingVertical: 2,
                    borderRadius: 4,
                    marginRight: 8,
                  }
                ]}>
                  <Text style={[commonStyles.textSecondary, { color: colors.text, fontSize: 10 }]}>
                    {transaction.type.toUpperCase()}
                  </Text>
                </View>
                <Text style={[commonStyles.text, { fontWeight: '600' }]}>
                  {transaction.symbol}
                </Text>
              </View>
              <Text style={commonStyles.textSecondary}>
                {new Date(transaction.date).toLocaleDateString()} {new Date(transaction.date).toLocaleTimeString()}
              </Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={[commonStyles.text, { fontWeight: '600' }]}>
                ${transaction.total.toLocaleString()}
              </Text>
              <Text style={commonStyles.textSecondary}>
                {transaction.amount} @ ${transaction.price.toLocaleString()}
              </Text>
            </View>
          </View>
        </View>
      ))}
    </View>
  );

  return (
    <View style={commonStyles.container}>
      <View style={commonStyles.header}>
        <View style={commonStyles.row}>
          <TouchableOpacity onPress={() => navigation.dispatch(DrawerActions.openDrawer())}>
            <Icon name="menu" size={24} style={{ color: colors.text }} />
          </TouchableOpacity>
          <Text style={commonStyles.headerTitle}>Portfolio</Text>
          <TouchableOpacity onPress={() => console.log('Portfolio settings')}>
            <Icon name="options" size={24} style={{ color: colors.text }} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={commonStyles.content}>
        {/* Portfolio Overview */}
        <View style={commonStyles.card}>
          <Text style={[commonStyles.subtitle, commonStyles.mb16]}>Portfolio Value</Text>
          
          <Text style={[commonStyles.title, { fontSize: 32, marginBottom: 8 }]}>
            ${portfolioStats.totalValue.toLocaleString()}
          </Text>

          <View style={[commonStyles.row, commonStyles.mb16]}>
            <View style={commonStyles.flex1}>
              <Text style={[commonStyles.textSecondary, { marginBottom: 4 }]}>Total P&L</Text>
              <Text style={[commonStyles.text, { color: getProfitColor(portfolioStats.totalPnL), fontWeight: '600' }]}>
                ${portfolioStats.totalPnL.toFixed(2)} ({portfolioStats.totalPnLPercent > 0 ? '+' : ''}{portfolioStats.totalPnLPercent.toFixed(2)}%)
              </Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={[commonStyles.textSecondary, { marginBottom: 4 }]}>Today</Text>
              <Text style={[commonStyles.text, { color: getProfitColor(portfolioStats.todayChange), fontWeight: '600' }]}>
                ${portfolioStats.todayChange.toFixed(2)} ({portfolioStats.todayChangePercent > 0 ? '+' : ''}{portfolioStats.todayChangePercent.toFixed(2)}%)
              </Text>
            </View>
          </View>

          {/* Quick Actions */}
          <View style={[commonStyles.row, { marginTop: 16 }]}>
            <TouchableOpacity
              style={[
                {
                  flex: 1,
                  backgroundColor: colors.success,
                  paddingVertical: 12,
                  borderRadius: 8,
                  alignItems: 'center',
                  marginRight: 8,
                }
              ]}
              onPress={() => console.log('Buy crypto')}
            >
              <Text style={[commonStyles.text, { fontWeight: '600' }]}>Buy</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                {
                  flex: 1,
                  backgroundColor: colors.danger,
                  paddingVertical: 12,
                  borderRadius: 8,
                  alignItems: 'center',
                  marginLeft: 8,
                }
              ]}
              onPress={() => console.log('Sell crypto')}
            >
              <Text style={[commonStyles.text, { fontWeight: '600' }]}>Sell</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Tab Navigation */}
        <View style={[
          {
            backgroundColor: colors.card,
            borderRadius: 12,
            padding: 4,
            marginBottom: 16,
            flexDirection: 'row',
          }
        ]}>
          <TouchableOpacity
            style={[
              {
                flex: 1,
                paddingVertical: 12,
                borderRadius: 8,
                alignItems: 'center',
                backgroundColor: selectedTab === 'holdings' ? colors.accent : 'transparent',
              }
            ]}
            onPress={() => setSelectedTab('holdings')}
          >
            <Text style={[
              commonStyles.text,
              {
                color: selectedTab === 'holdings' ? colors.text : colors.textSecondary,
                fontWeight: selectedTab === 'holdings' ? '600' : '400',
              }
            ]}>
              Holdings
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              {
                flex: 1,
                paddingVertical: 12,
                borderRadius: 8,
                alignItems: 'center',
                backgroundColor: selectedTab === 'transactions' ? colors.accent : 'transparent',
              }
            ]}
            onPress={() => setSelectedTab('transactions')}
          >
            <Text style={[
              commonStyles.text,
              {
                color: selectedTab === 'transactions' ? colors.text : colors.textSecondary,
                fontWeight: selectedTab === 'transactions' ? '600' : '400',
              }
            ]}>
              Transactions
            </Text>
          </TouchableOpacity>
        </View>

        {/* Tab Content */}
        {selectedTab === 'holdings' ? renderHoldings() : renderTransactions()}
      </ScrollView>
    </View>
  );
}