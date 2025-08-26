import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { router } from 'expo-router';
import { commonStyles, colors } from '../../styles/commonStyles';
import Icon from '../../components/Icon';
import { DrawerActions } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';

interface PortfolioData {
  totalValue: number;
  totalPnL: number;
  totalPnLPercent: number;
  activeBots: number;
  totalTrades: number;
  todayPnL: number;
  todayPnLPercent: number;
}

interface BotData {
  id: string;
  name: string;
  pair: string;
  profit: number;
  profitPercent: number;
  status: 'active' | 'inactive' | 'error';
  trades: number;
  type: 'DCA' | 'Grid' | 'Long' | 'Short';
}

interface MarketData {
  symbol: string;
  price: number;
  change24h: number;
  changePercent24h: number;
}

export default function Dashboard() {
  const navigation = useNavigation();
  const [refreshing, setRefreshing] = useState(false);
  const [portfolioData, setPortfolioData] = useState<PortfolioData>({
    totalValue: 12543.67,
    totalPnL: 1234.56,
    totalPnLPercent: 10.92,
    activeBots: 8,
    totalTrades: 156,
    todayPnL: 45.23,
    todayPnLPercent: 0.36,
  });

  const [bots, setBots] = useState<BotData[]>([
    {
      id: '1',
      name: 'BTC Long Bot',
      pair: 'BTC/USDT',
      profit: 234.56,
      profitPercent: 5.67,
      status: 'active',
      trades: 23,
      type: 'Long',
    },
    {
      id: '2',
      name: 'ETH DCA Bot',
      pair: 'ETH/USDT',
      profit: -45.23,
      profitPercent: -2.34,
      status: 'active',
      trades: 12,
      type: 'DCA',
    },
    {
      id: '3',
      name: 'ADA Grid Bot',
      pair: 'ADA/USDT',
      profit: 123.45,
      profitPercent: 8.91,
      status: 'inactive',
      trades: 45,
      type: 'Grid',
    },
  ]);

  const [marketData, setMarketData] = useState<MarketData[]>([
    { symbol: 'BTC', price: 43250.00, change24h: 1250.50, changePercent24h: 2.98 },
    { symbol: 'ETH', price: 2650.75, change24h: -45.25, changePercent24h: -1.68 },
    { symbol: 'BNB', price: 315.20, change24h: 8.45, changePercent24h: 2.76 },
  ]);

  const onRefresh = async () => {
    setRefreshing(true);
    console.log('Refreshing dashboard data...');
    // Simulate API call
    setTimeout(() => {
      setRefreshing(false);
      console.log('Dashboard refresh completed');
    }, 1000);
  };

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

  return (
    <View style={commonStyles.container}>
      <View style={commonStyles.header}>
        <View style={commonStyles.row}>
          <TouchableOpacity onPress={() => navigation.dispatch(DrawerActions.openDrawer())}>
            <Icon name="menu" size={24} style={{ color: colors.text }} />
          </TouchableOpacity>
          <Text style={commonStyles.headerTitle}>Dashboard</Text>
          <TouchableOpacity onPress={() => router.push('/(main)/settings')}>
            <Icon name="notifications" size={24} style={{ color: colors.text }} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={commonStyles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Portfolio Overview */}
        <View style={commonStyles.card}>
          <Text style={[commonStyles.subtitle, commonStyles.mb16]}>Portfolio Overview</Text>
          
          <View style={[commonStyles.row, commonStyles.mb8]}>
            <Text style={commonStyles.textSecondary}>Total Value</Text>
            <Text style={[commonStyles.text, { fontWeight: '700', fontSize: 18 }]}>
              ${portfolioData.totalValue.toLocaleString()}
            </Text>
          </View>

          <View style={[commonStyles.row, commonStyles.mb8]}>
            <Text style={commonStyles.textSecondary}>Total P&L</Text>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={[commonStyles.text, { color: getProfitColor(portfolioData.totalPnL), fontWeight: '600' }]}>
                ${portfolioData.totalPnL.toFixed(2)}
              </Text>
              <Text style={[commonStyles.textSecondary, { color: getProfitColor(portfolioData.totalPnL) }]}>
                ({portfolioData.totalPnLPercent > 0 ? '+' : ''}{portfolioData.totalPnLPercent.toFixed(2)}%)
              </Text>
            </View>
          </View>

          <View style={[commonStyles.row, commonStyles.mb8]}>
            <Text style={commonStyles.textSecondary}>Today&apos;s P&L</Text>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={[commonStyles.text, { color: getProfitColor(portfolioData.todayPnL), fontWeight: '600' }]}>
                ${portfolioData.todayPnL.toFixed(2)}
              </Text>
              <Text style={[commonStyles.textSecondary, { color: getProfitColor(portfolioData.todayPnL) }]}>
                ({portfolioData.todayPnLPercent > 0 ? '+' : ''}{portfolioData.todayPnLPercent.toFixed(2)}%)
              </Text>
            </View>
          </View>

          <View style={[commonStyles.row, commonStyles.mb8]}>
            <Text style={commonStyles.textSecondary}>Active Bots</Text>
            <Text style={[commonStyles.text, { fontWeight: '600', color: colors.accent }]}>
              {portfolioData.activeBots}
            </Text>
          </View>

          <View style={commonStyles.row}>
            <Text style={commonStyles.textSecondary}>Total Trades</Text>
            <Text style={[commonStyles.text, { fontWeight: '600' }]}>
              {portfolioData.totalTrades}
            </Text>
          </View>
        </View>

        {/* Market Overview */}
        <View style={commonStyles.card}>
          <Text style={[commonStyles.subtitle, commonStyles.mb16]}>Market Overview</Text>
          
          {marketData.map((market) => (
            <View key={market.symbol} style={[commonStyles.row, commonStyles.mb8]}>
              <View style={commonStyles.flex1}>
                <Text style={[commonStyles.text, { fontWeight: '600' }]}>{market.symbol}</Text>
                <Text style={commonStyles.textSecondary}>${market.price.toLocaleString()}</Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={[commonStyles.text, { color: getProfitColor(market.change24h), fontWeight: '600' }]}>
                  {market.change24h > 0 ? '+' : ''}${market.change24h.toFixed(2)}
                </Text>
                <Text style={[commonStyles.textSecondary, { color: getProfitColor(market.change24h) }]}>
                  ({market.changePercent24h > 0 ? '+' : ''}{market.changePercent24h.toFixed(2)}%)
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Quick Actions */}
        <View style={commonStyles.card}>
          <Text style={[commonStyles.subtitle, commonStyles.mb16]}>Quick Actions</Text>
          
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <TouchableOpacity
              style={[{ flex: 1, alignItems: 'center', padding: 16, backgroundColor: colors.secondary, borderRadius: 8, marginRight: 8 }]}
              onPress={() => router.push('/(main)/bots/create')}
            >
              <Icon name="add-circle" size={32} style={{ color: colors.accent, marginBottom: 8 }} />
              <Text style={[commonStyles.textSecondary, { fontSize: 12 }]}>Create Bot</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[{ flex: 1, alignItems: 'center', padding: 16, backgroundColor: colors.secondary, borderRadius: 8, marginHorizontal: 4 }]}
              onPress={() => router.push('/(main)/portfolio')}
            >
              <Icon name="pie-chart" size={32} style={{ color: colors.accent, marginBottom: 8 }} />
              <Text style={[commonStyles.textSecondary, { fontSize: 12 }]}>Portfolio</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[{ flex: 1, alignItems: 'center', padding: 16, backgroundColor: colors.secondary, borderRadius: 8, marginLeft: 8 }]}
              onPress={() => router.push('/(main)/trades')}
            >
              <Icon name="bar-chart" size={32} style={{ color: colors.accent, marginBottom: 8 }} />
              <Text style={[commonStyles.textSecondary, { fontSize: 12 }]}>Trades</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Active Bots */}
        <View style={commonStyles.card}>
          <View style={[commonStyles.row, commonStyles.mb16]}>
            <Text style={commonStyles.subtitle}>Active Bots</Text>
            <TouchableOpacity onPress={() => router.push('/(main)/bots')}>
              <Text style={[commonStyles.textSecondary, { color: colors.accent }]}>View All</Text>
            </TouchableOpacity>
          </View>

          {bots.map((bot) => (
            <TouchableOpacity
              key={bot.id}
              style={[
                {
                  backgroundColor: colors.secondary,
                  borderRadius: 8,
                  padding: 12,
                  marginBottom: 8,
                  borderLeftWidth: 4,
                  borderLeftColor: getStatusColor(bot.status),
                }
              ]}
              onPress={() => router.push(`/(main)/bots/${bot.id}`)}
            >
              <View style={[commonStyles.row, commonStyles.mb8]}>
                <View style={commonStyles.flex1}>
                  <View style={[commonStyles.rowCenter, { marginBottom: 4 }]}>
                    <Text style={[commonStyles.text, { fontWeight: '600', marginRight: 8 }]}>{bot.name}</Text>
                    <View style={[
                      {
                        backgroundColor: getTypeColor(bot.type),
                        paddingHorizontal: 6,
                        paddingVertical: 2,
                        borderRadius: 4,
                      }
                    ]}>
                      <Text style={[commonStyles.textSecondary, { fontSize: 10, color: colors.text }]}>
                        {bot.type}
                      </Text>
                    </View>
                  </View>
                  <Text style={commonStyles.textSecondary}>{bot.pair}</Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={[commonStyles.text, { color: getProfitColor(bot.profit), fontWeight: '600' }]}>
                    ${bot.profit.toFixed(2)}
                  </Text>
                  <Text style={[commonStyles.textSecondary, { color: getProfitColor(bot.profit) }]}>
                    ({bot.profitPercent > 0 ? '+' : ''}{bot.profitPercent.toFixed(2)}%)
                  </Text>
                </View>
              </View>
              
              <View style={commonStyles.row}>
                <View style={commonStyles.rowCenter}>
                  <View style={[
                    {
                      width: 8,
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: getStatusColor(bot.status),
                      marginRight: 6,
                    }
                  ]} />
                  <Text style={[commonStyles.textSecondary, { textTransform: 'capitalize' }]}>
                    {bot.status}
                  </Text>
                </View>
                <Text style={commonStyles.textSecondary}>
                  {bot.trades} trades
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}