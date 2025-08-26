import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { router } from 'expo-router';
import { commonStyles, colors } from '../../../styles/commonStyles';
import Icon from '../../../components/Icon';
import Button from '../../../components/Button';
import { DrawerActions } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';

interface Bot {
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
}

export default function BotsScreen() {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive' | 'error'>('all');
  const [filterType, setFilterType] = useState<'all' | 'DCA' | 'Grid' | 'Long' | 'Short'>('all');

  const [bots, setBots] = useState<Bot[]>([
    {
      id: '1',
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
    },
    {
      id: '2',
      name: 'ETH DCA Bot',
      pair: 'ETH/USDT',
      type: 'DCA',
      profit: -45.23,
      profitPercent: -2.34,
      status: 'active',
      trades: 12,
      created: '2024-01-10',
      baseOrderSize: 50,
      safetyOrderSize: 100,
      maxSafetyTrades: 7,
      takeProfit: 1.5,
    },
    {
      id: '3',
      name: 'ADA Grid Bot',
      pair: 'ADA/USDT',
      type: 'Grid',
      profit: 123.45,
      profitPercent: 8.91,
      status: 'inactive',
      trades: 45,
      created: '2024-01-05',
      baseOrderSize: 25,
      safetyOrderSize: 50,
      maxSafetyTrades: 10,
      takeProfit: 3.0,
    },
    {
      id: '4',
      name: 'SOL Short Bot',
      pair: 'SOL/USDT',
      type: 'Short',
      profit: 67.89,
      profitPercent: 3.45,
      status: 'error',
      trades: 8,
      created: '2024-01-20',
      baseOrderSize: 75,
      safetyOrderSize: 150,
      maxSafetyTrades: 3,
      takeProfit: 2.0,
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

  const filteredBots = bots.filter(bot => {
    const matchesSearch = bot.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         bot.pair.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || bot.status === filterStatus;
    const matchesType = filterType === 'all' || bot.type === filterType;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const toggleBotStatus = (botId: string) => {
    setBots(prevBots => 
      prevBots.map(bot => 
        bot.id === botId 
          ? { ...bot, status: bot.status === 'active' ? 'inactive' : 'active' as any }
          : bot
      )
    );
    console.log(`Toggled bot ${botId} status`);
  };

  return (
    <View style={commonStyles.container}>
      <View style={commonStyles.header}>
        <View style={commonStyles.row}>
          <TouchableOpacity onPress={() => navigation.dispatch(DrawerActions.openDrawer())}>
            <Icon name="menu" size={24} style={{ color: colors.text }} />
          </TouchableOpacity>
          <Text style={commonStyles.headerTitle}>Trading Bots</Text>
          <TouchableOpacity onPress={() => router.push('/(main)/bots/create')}>
            <Icon name="add" size={24} style={{ color: colors.text }} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={commonStyles.content}>
        {/* Search and Filters */}
        <View style={[commonStyles.card, { marginBottom: 16 }]}>
          <View style={[commonStyles.row, { marginBottom: 16 }]}>
            <View style={[commonStyles.flex1, { marginRight: 12 }]}>
              <TextInput
                style={commonStyles.input}
                placeholder="Search bots..."
                placeholderTextColor={colors.textSecondary}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>
            <TouchableOpacity
              style={[
                {
                  backgroundColor: colors.accent,
                  padding: 12,
                  borderRadius: 8,
                  alignItems: 'center',
                  justifyContent: 'center',
                }
              ]}
              onPress={() => router.push('/(main)/bots/create')}
            >
              <Icon name="add" size={20} style={{ color: colors.text }} />
            </TouchableOpacity>
          </View>

          {/* Filter Buttons */}
          <View style={{ marginBottom: 12 }}>
            <Text style={[commonStyles.textSecondary, { marginBottom: 8 }]}>Status</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {['all', 'active', 'inactive', 'error'].map((status) => (
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
              {['all', 'DCA', 'Grid', 'Long', 'Short'].map((type) => (
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
                    }
                  ]}>
                    {type}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>

        {/* Bots List */}
        {filteredBots.length === 0 ? (
          <View style={[commonStyles.card, { alignItems: 'center', padding: 40 }]}>
            <Icon name="robot" size={48} style={{ color: colors.textSecondary, marginBottom: 16 }} />
            <Text style={[commonStyles.text, { marginBottom: 8 }]}>No bots found</Text>
            <Text style={[commonStyles.textSecondary, { textAlign: 'center', marginBottom: 20 }]}>
              {searchQuery || filterStatus !== 'all' || filterType !== 'all' 
                ? 'Try adjusting your search or filters'
                : 'Create your first trading bot to get started'
              }
            </Text>
            <Button
              text="Create Bot"
              onPress={() => router.push('/(main)/bots/create')}
              style={{ backgroundColor: colors.accent, paddingHorizontal: 24 }}
            />
          </View>
        ) : (
          filteredBots.map((bot) => (
            <TouchableOpacity
              key={bot.id}
              style={[
                commonStyles.card,
                {
                  borderLeftWidth: 4,
                  borderLeftColor: getStatusColor(bot.status),
                }
              ]}
              onPress={() => router.push(`/(main)/bots/${bot.id}`)}
            >
              <View style={[commonStyles.row, commonStyles.mb8]}>
                <View style={commonStyles.flex1}>
                  <View style={[commonStyles.rowCenter, { marginBottom: 4 }]}>
                    <Text style={[commonStyles.text, { fontWeight: '600', marginRight: 8 }]}>
                      {bot.name}
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

              <View style={[commonStyles.row, commonStyles.mb8]}>
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

              <View style={[commonStyles.row, { alignItems: 'center' }]}>
                <View style={commonStyles.flex1}>
                  <Text style={[commonStyles.textSecondary, { fontSize: 12 }]}>
                    Created: {new Date(bot.created).toLocaleDateString()}
                  </Text>
                </View>
                <TouchableOpacity
                  style={[
                    {
                      backgroundColor: bot.status === 'active' ? colors.danger : colors.success,
                      paddingHorizontal: 12,
                      paddingVertical: 6,
                      borderRadius: 6,
                    }
                  ]}
                  onPress={(e) => {
                    e.stopPropagation();
                    toggleBotStatus(bot.id);
                  }}
                >
                  <Text style={[commonStyles.textSecondary, { color: colors.text, fontSize: 12 }]}>
                    {bot.status === 'active' ? 'Stop' : 'Start'}
                  </Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </View>
  );
}