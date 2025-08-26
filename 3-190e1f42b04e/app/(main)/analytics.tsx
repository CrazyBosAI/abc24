import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { router } from 'expo-router';
import { commonStyles, colors } from '../../styles/commonStyles';
import Icon from '../../components/Icon';
import { DrawerActions } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';

interface PerformanceData {
  period: string;
  profit: number;
  profitPercent: number;
  trades: number;
  winRate: number;
}

interface BotPerformance {
  botName: string;
  profit: number;
  profitPercent: number;
  trades: number;
  winRate: number;
  type: string;
}

export default function AnalyticsScreen() {
  const navigation = useNavigation();
  const [selectedPeriod, setSelectedPeriod] = useState<'1D' | '7D' | '30D' | '90D' | '1Y'>('30D');

  const [performanceData, setPerformanceData] = useState<PerformanceData[]>([
    { period: '1D', profit: 45.23, profitPercent: 0.36, trades: 12, winRate: 75.0 },
    { period: '7D', profit: 234.56, profitPercent: 1.87, trades: 89, winRate: 68.5 },
    { period: '30D', profit: 1234.56, profitPercent: 10.92, trades: 356, winRate: 72.2 },
    { period: '90D', profit: 2845.67, profitPercent: 28.45, trades: 1024, winRate: 69.8 },
    { period: '1Y', profit: 8234.12, profitPercent: 82.34, trades: 4567, winRate: 71.5 },
  ]);

  const [botPerformance, setBotPerformance] = useState<BotPerformance[]>([
    {
      botName: 'BTC Long Bot',
      profit: 456.78,
      profitPercent: 15.23,
      trades: 89,
      winRate: 78.5,
      type: 'Long',
    },
    {
      botName: 'ETH DCA Bot',
      profit: 234.56,
      profitPercent: 8.92,
      trades: 156,
      winRate: 65.4,
      type: 'DCA',
    },
    {
      botName: 'ADA Grid Bot',
      profit: 345.67,
      profitPercent: 12.34,
      trades: 234,
      winRate: 72.6,
      type: 'Grid',
    },
    {
      botName: 'SOL Short Bot',
      profit: 123.45,
      profitPercent: 5.67,
      trades: 67,
      winRate: 69.2,
      type: 'Short',
    },
  ]);

  const currentData = performanceData.find(data => data.period === selectedPeriod) || performanceData[2];

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

  const getWinRateColor = (winRate: number) => {
    if (winRate >= 70) return colors.success;
    if (winRate >= 60) return colors.warning;
    return colors.danger;
  };

  return (
    <View style={commonStyles.container}>
      <View style={commonStyles.header}>
        <View style={commonStyles.row}>
          <TouchableOpacity onPress={() => navigation.dispatch(DrawerActions.openDrawer())}>
            <Icon name="menu" size={24} style={{ color: colors.text }} />
          </TouchableOpacity>
          <Text style={commonStyles.headerTitle}>Analytics</Text>
          <TouchableOpacity onPress={() => console.log('Export analytics')}>
            <Icon name="download" size={24} style={{ color: colors.text }} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={commonStyles.content}>
        {/* Period Selector */}
        <View style={[
          {
            backgroundColor: colors.card,
            borderRadius: 12,
            padding: 4,
            marginBottom: 16,
            flexDirection: 'row',
          }
        ]}>
          {['1D', '7D', '30D', '90D', '1Y'].map((period) => (
            <TouchableOpacity
              key={period}
              style={[
                {
                  flex: 1,
                  paddingVertical: 8,
                  borderRadius: 8,
                  alignItems: 'center',
                  backgroundColor: selectedPeriod === period ? colors.accent : 'transparent',
                }
              ]}
              onPress={() => setSelectedPeriod(period as any)}
            >
              <Text style={[
                commonStyles.text,
                {
                  color: selectedPeriod === period ? colors.text : colors.textSecondary,
                  fontWeight: selectedPeriod === period ? '600' : '400',
                  fontSize: 14,
                }
              ]}>
                {period}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Performance Overview */}
        <View style={commonStyles.card}>
          <Text style={[commonStyles.subtitle, commonStyles.mb16]}>
            Performance Overview ({selectedPeriod})
          </Text>
          
          <View style={[commonStyles.row, commonStyles.mb16]}>
            <View style={[commonStyles.flex1, { alignItems: 'center' }]}>
              <Text style={[commonStyles.textSecondary, { marginBottom: 4 }]}>Total Profit</Text>
              <Text style={[
                commonStyles.text,
                {
                  fontSize: 20,
                  fontWeight: '700',
                  color: getProfitColor(currentData.profit),
                }
              ]}>
                ${currentData.profit.toFixed(2)}
              </Text>
              <Text style={[
                commonStyles.textSecondary,
                { color: getProfitColor(currentData.profit) }
              ]}>
                ({currentData.profitPercent > 0 ? '+' : ''}{currentData.profitPercent.toFixed(2)}%)
              </Text>
            </View>
            <View style={[commonStyles.flex1, { alignItems: 'center' }]}>
              <Text style={[commonStyles.textSecondary, { marginBottom: 4 }]}>Win Rate</Text>
              <Text style={[
                commonStyles.text,
                {
                  fontSize: 20,
                  fontWeight: '700',
                  color: getWinRateColor(currentData.winRate),
                }
              ]}>
                {currentData.winRate.toFixed(1)}%
              </Text>
              <Text style={commonStyles.textSecondary}>
                {Math.round(currentData.trades * currentData.winRate / 100)} / {currentData.trades}
              </Text>
            </View>
          </View>

          <View style={[commonStyles.row, { justifyContent: 'space-around' }]}>
            <View style={{ alignItems: 'center' }}>
              <Text style={[commonStyles.textSecondary, { marginBottom: 4 }]}>Total Trades</Text>
              <Text style={[commonStyles.text, { fontWeight: '600' }]}>
                {currentData.trades}
              </Text>
            </View>
            <View style={{ alignItems: 'center' }}>
              <Text style={[commonStyles.textSecondary, { marginBottom: 4 }]}>Avg Profit/Trade</Text>
              <Text style={[commonStyles.text, { fontWeight: '600', color: getProfitColor(currentData.profit) }]}>
                ${(currentData.profit / currentData.trades).toFixed(2)}
              </Text>
            </View>
          </View>
        </View>

        {/* Bot Performance Ranking */}
        <View style={commonStyles.card}>
          <Text style={[commonStyles.subtitle, commonStyles.mb16]}>Bot Performance Ranking</Text>
          
          {botPerformance
            .sort((a, b) => b.profitPercent - a.profitPercent)
            .map((bot, index) => (
              <TouchableOpacity
                key={bot.botName}
                style={[
                  {
                    backgroundColor: colors.secondary,
                    borderRadius: 8,
                    padding: 12,
                    marginBottom: 8,
                    borderLeftWidth: 4,
                    borderLeftColor: index === 0 ? colors.success : index === 1 ? colors.warning : colors.textSecondary,
                  }
                ]}
                onPress={() => console.log(`Viewing ${bot.botName} details`)}
              >
                <View style={[commonStyles.row, commonStyles.mb8]}>
                  <View style={commonStyles.flex1}>
                    <View style={[commonStyles.rowCenter, { marginBottom: 4 }]}>
                      <Text style={[
                        commonStyles.text,
                        {
                          fontWeight: '600',
                          marginRight: 8,
                          color: index < 3 ? colors.accent : colors.text,
                        }
                      ]}>
                        #{index + 1} {bot.botName}
                      </Text>
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
                  <Text style={commonStyles.textSecondary}>
                    {bot.trades} trades
                  </Text>
                  <Text style={[commonStyles.textSecondary, { color: getWinRateColor(bot.winRate) }]}>
                    {bot.winRate.toFixed(1)}% win rate
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
        </View>

        {/* Trading Statistics */}
        <View style={commonStyles.card}>
          <Text style={[commonStyles.subtitle, commonStyles.mb16]}>Trading Statistics</Text>
          
          <View style={[commonStyles.row, commonStyles.mb8]}>
            <Text style={commonStyles.textSecondary}>Best Performing Bot</Text>
            <Text style={[commonStyles.text, { fontWeight: '600', color: colors.success }]}>
              {botPerformance.sort((a, b) => b.profitPercent - a.profitPercent)[0].botName}
            </Text>
          </View>

          <View style={[commonStyles.row, commonStyles.mb8]}>
            <Text style={commonStyles.textSecondary}>Most Active Bot</Text>
            <Text style={[commonStyles.text, { fontWeight: '600' }]}>
              {botPerformance.sort((a, b) => b.trades - a.trades)[0].botName}
            </Text>
          </View>

          <View style={[commonStyles.row, commonStyles.mb8]}>
            <Text style={commonStyles.textSecondary}>Highest Win Rate</Text>
            <Text style={[commonStyles.text, { fontWeight: '600', color: colors.success }]}>
              {botPerformance.sort((a, b) => b.winRate - a.winRate)[0].winRate.toFixed(1)}%
            </Text>
          </View>

          <View style={commonStyles.row}>
            <Text style={commonStyles.textSecondary}>Total Active Bots</Text>
            <Text style={[commonStyles.text, { fontWeight: '600', color: colors.accent }]}>
              {botPerformance.length}
            </Text>
          </View>
        </View>

        {/* Risk Metrics */}
        <View style={commonStyles.card}>
          <Text style={[commonStyles.subtitle, commonStyles.mb16]}>Risk Metrics</Text>
          
          <View style={[commonStyles.row, commonStyles.mb8]}>
            <Text style={commonStyles.textSecondary}>Max Drawdown</Text>
            <Text style={[commonStyles.text, { fontWeight: '600', color: colors.danger }]}>
              -5.67%
            </Text>
          </View>

          <View style={[commonStyles.row, commonStyles.mb8]}>
            <Text style={commonStyles.textSecondary}>Sharpe Ratio</Text>
            <Text style={[commonStyles.text, { fontWeight: '600', color: colors.success }]}>
              1.85
            </Text>
          </View>

          <View style={[commonStyles.row, commonStyles.mb8]}>
            <Text style={commonStyles.textSecondary}>Volatility</Text>
            <Text style={[commonStyles.text, { fontWeight: '600', color: colors.warning }]}>
              12.34%
            </Text>
          </View>

          <View style={commonStyles.row}>
            <Text style={commonStyles.textSecondary}>Risk Score</Text>
            <Text style={[commonStyles.text, { fontWeight: '600', color: colors.warning }]}>
              Medium
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}