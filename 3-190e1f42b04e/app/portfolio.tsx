import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { router } from 'expo-router';
import { commonStyles, colors } from '../styles/commonStyles';
import Icon from '../components/Icon';

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
  const [activeTab, setActiveTab] = useState<'holdings' | 'transactions'>('holdings');
  
  const [portfolioStats] = useState({
    totalValue: 12543.67,
    totalPnL: 1234.56,
    totalPnLPercent: 10.92,
    dayChange: 234.12,
    dayChangePercent: 1.87,
  });

  const [holdings] = useState<Holding[]>([
    {
      symbol: 'BTC',
      name: 'Bitcoin',
      amount: 0.5234,
      value: 6543.21,
      price: 43250.00,
      change24h: 2.34,
      allocation: 52.1,
    },
    {
      symbol: 'ETH',
      name: 'Ethereum',
      amount: 2.1567,
      value: 3456.78,
      price: 2650.00,
      change24h: -1.23,
      allocation: 27.6,
    },
    {
      symbol: 'ADA',
      name: 'Cardano',
      amount: 1234.56,
      value: 1543.68,
      price: 0.45,
      change24h: 5.67,
      allocation: 12.3,
    },
    {
      symbol: 'SOL',
      name: 'Solana',
      amount: 12.34,
      value: 1000.00,
      price: 98.50,
      change24h: -3.45,
      allocation: 8.0,
    },
  ]);

  const [transactions] = useState<Transaction[]>([
    {
      id: '1',
      type: 'buy',
      symbol: 'BTC',
      amount: 0.1,
      price: 42000.00,
      total: 4200.00,
      date: '2024-01-15 14:30',
    },
    {
      id: '2',
      type: 'sell',
      symbol: 'ETH',
      amount: 0.5,
      price: 2700.00,
      total: 1350.00,
      date: '2024-01-14 09:15',
    },
    {
      id: '3',
      type: 'buy',
      symbol: 'ADA',
      amount: 500,
      price: 0.44,
      total: 220.00,
      date: '2024-01-13 16:45',
    },
  ]);

  const getProfitColor = (value: number) => {
    return value >= 0 ? colors.success : colors.danger;
  };

  const renderHoldings = () => (
    <ScrollView showsVerticalScrollIndicator={false}>
      {holdings.map((holding, index) => (
        <TouchableOpacity key={holding.symbol} style={commonStyles.card}>
          <View style={[commonStyles.row, commonStyles.mb8]}>
            <View style={commonStyles.flex1}>
              <View style={commonStyles.rowCenter}>
                <View style={[
                  {
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    backgroundColor: colors.accent,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: 12,
                  }
                ]}>
                  <Text style={[commonStyles.text, { fontWeight: '700', fontSize: 16 }]}>
                    {holding.symbol.charAt(0)}
                  </Text>
                </View>
                <View>
                  <Text style={[commonStyles.text, { fontWeight: '600' }]}>
                    {holding.symbol}
                  </Text>
                  <Text style={commonStyles.textSecondary}>
                    {holding.name}
                  </Text>
                </View>
              </View>
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
              {holding.amount.toFixed(4)} {holding.symbol}
            </Text>
            <Text style={commonStyles.textSecondary}>
              ${holding.price.toLocaleString()}
            </Text>
          </View>

          <View style={commonStyles.row}>
            <Text style={commonStyles.textSecondary}>
              {holding.allocation.toFixed(1)}% of portfolio
            </Text>
            <View style={[
              {
                width: 60,
                height: 4,
                backgroundColor: colors.secondary,
                borderRadius: 2,
                overflow: 'hidden',
              }
            ]}>
              <View style={[
                {
                  width: `${holding.allocation}%`,
                  height: '100%',
                  backgroundColor: colors.accent,
                }
              ]} />
            </View>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  const renderTransactions = () => (
    <ScrollView showsVerticalScrollIndicator={false}>
      {transactions.map((transaction) => (
        <View key={transaction.id} style={commonStyles.card}>
          <View style={[commonStyles.row, commonStyles.mb8]}>
            <View style={commonStyles.rowCenter}>
              <View style={[
                {
                  width: 32,
                  height: 32,
                  borderRadius: 16,
                  backgroundColor: transaction.type === 'buy' ? colors.success : colors.danger,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: 12,
                }
              ]}>
                <Icon 
                  name={transaction.type === 'buy' ? 'arrow-down' : 'arrow-up'} 
                  size={16} 
                  style={{ color: colors.text }} 
                />
              </View>
              <View>
                <Text style={[commonStyles.text, { fontWeight: '600', textTransform: 'uppercase' }]}>
                  {transaction.type} {transaction.symbol}
                </Text>
                <Text style={commonStyles.textSecondary}>
                  {transaction.date}
                </Text>
              </View>
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
    </ScrollView>
  );

  return (
    <View style={commonStyles.container}>
      <View style={commonStyles.header}>
        <View style={commonStyles.row}>
          <TouchableOpacity onPress={() => router.back()}>
            <Icon name="arrow-back" size={24} style={{ color: colors.text }} />
          </TouchableOpacity>
          <Text style={commonStyles.headerTitle}>Portfolio</Text>
          <TouchableOpacity>
            <Icon name="refresh" size={24} style={{ color: colors.text }} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={commonStyles.content}>
        {/* Portfolio Stats */}
        <View style={commonStyles.card}>
          <Text style={[commonStyles.title, commonStyles.textCenter]}>
            ${portfolioStats.totalValue.toLocaleString()}
          </Text>
          <Text style={[commonStyles.textSecondary, commonStyles.textCenter, commonStyles.mb16]}>
            Total Portfolio Value
          </Text>

          <View style={[commonStyles.row, commonStyles.mb8]}>
            <Text style={commonStyles.textSecondary}>Total P&L</Text>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={[commonStyles.text, { color: getProfitColor(portfolioStats.totalPnL), fontWeight: '600' }]}>
                ${portfolioStats.totalPnL.toFixed(2)}
              </Text>
              <Text style={[commonStyles.textSecondary, { color: getProfitColor(portfolioStats.totalPnL) }]}>
                ({portfolioStats.totalPnLPercent > 0 ? '+' : ''}{portfolioStats.totalPnLPercent.toFixed(2)}%)
              </Text>
            </View>
          </View>

          <View style={commonStyles.row}>
            <Text style={commonStyles.textSecondary}>24h Change</Text>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={[commonStyles.text, { color: getProfitColor(portfolioStats.dayChange), fontWeight: '600' }]}>
                ${portfolioStats.dayChange.toFixed(2)}
              </Text>
              <Text style={[commonStyles.textSecondary, { color: getProfitColor(portfolioStats.dayChange) }]}>
                ({portfolioStats.dayChangePercent > 0 ? '+' : ''}{portfolioStats.dayChangePercent.toFixed(2)}%)
              </Text>
            </View>
          </View>
        </View>

        {/* Tab Navigation */}
        <View style={[commonStyles.card, { paddingVertical: 8 }]}>
          <View style={commonStyles.row}>
            <TouchableOpacity
              style={[
                {
                  flex: 1,
                  paddingVertical: 12,
                  alignItems: 'center',
                  borderRadius: 8,
                  backgroundColor: activeTab === 'holdings' ? colors.accent : 'transparent',
                }
              ]}
              onPress={() => setActiveTab('holdings')}
            >
              <Text style={[
                commonStyles.text,
                { fontWeight: '600' },
                activeTab === 'holdings' && { color: colors.text }
              ]}>
                Holdings
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                {
                  flex: 1,
                  paddingVertical: 12,
                  alignItems: 'center',
                  borderRadius: 8,
                  backgroundColor: activeTab === 'transactions' ? colors.accent : 'transparent',
                }
              ]}
              onPress={() => setActiveTab('transactions')}
            >
              <Text style={[
                commonStyles.text,
                { fontWeight: '600' },
                activeTab === 'transactions' && { color: colors.text }
              ]}>
                Transactions
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Tab Content */}
        <View style={commonStyles.flex1}>
          {activeTab === 'holdings' ? renderHoldings() : renderTransactions()}
        </View>
      </View>
    </View>
  );
}