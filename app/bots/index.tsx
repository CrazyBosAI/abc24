import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { router } from 'expo-router';
import { commonStyles, colors } from '../../styles/commonStyles';
import Icon from '../../components/Icon';
import Button from '../../components/Button';

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
}

export default function BotsScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');
  
  const [bots] = useState<Bot[]>([
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
      created: '2024-01-08',
    },
    {
      id: '4',
      name: 'SOL Short Bot',
      pair: 'SOL/USDT',
      type: 'Short',
      profit: 67.89,
      profitPercent: 3.45,
      status: 'active',
      trades: 18,
      created: '2024-01-12',
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
      case 'Long':
        return colors.success;
      case 'Short':
        return colors.danger;
      case 'DCA':
        return colors.accentBlue;
      case 'Grid':
        return colors.warning;
      default:
        return colors.textSecondary;
    }
  };

  const filteredBots = bots.filter(bot => {
    const matchesSearch = bot.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         bot.pair.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || bot.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <View style={commonStyles.container}>
      <View style={commonStyles.header}>
        <View style={commonStyles.row}>
          <TouchableOpacity onPress={() => router.back()}>
            <Icon name="arrow-back" size={24} style={{ color: colors.text }} />
          </TouchableOpacity>
          <Text style={commonStyles.headerTitle}>Trading Bots</Text>
          <TouchableOpacity onPress={() => router.push('/bots/create')}>
            <Icon name="add" size={24} style={{ color: colors.accent }} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={commonStyles.content}>
        {/* Search and Filter */}
        <View style={commonStyles.card}>
          <TextInput
            style={[commonStyles.input, commonStyles.mb16]}
            placeholder="Search bots..."
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
                  backgroundColor: filterStatus === 'active' ? colors.accent : colors.secondary,
                  marginRight: 8,
                }
              ]}
              onPress={() => setFilterStatus('active')}
            >
              <Text style={[commonStyles.textSecondary, filterStatus === 'active' && { color: colors.text }]}>
                Active
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                {
                  paddingVertical: 8,
                  paddingHorizontal: 16,
                  borderRadius: 20,
                  backgroundColor: filterStatus === 'inactive' ? colors.accent : colors.secondary,
                }
              ]}
              onPress={() => setFilterStatus('inactive')}
            >
              <Text style={[commonStyles.textSecondary, filterStatus === 'inactive' && { color: colors.text }]}>
                Inactive
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {filteredBots.map((bot) => (
            <TouchableOpacity
              key={bot.id}
              style={[commonStyles.card]}
              onPress={() => router.push(`/bots/${bot.id}`)}
            >
              <View style={[commonStyles.row, commonStyles.mb8]}>
                <View style={commonStyles.flex1}>
                  <View style={commonStyles.rowCenter}>
                    <Text style={[commonStyles.text, { fontWeight: '600', marginRight: 8 }]}>
                      {bot.name}
                    </Text>
                    <View style={[
                      {
                        paddingVertical: 2,
                        paddingHorizontal: 8,
                        borderRadius: 12,
                        backgroundColor: getTypeColor(bot.type),
                      }
                    ]}>
                      <Text style={[{ fontSize: 10, color: colors.text, fontWeight: '600' }]}>
                        {bot.type}
                      </Text>
                    </View>
                  </View>
                  <Text style={[commonStyles.textSecondary, commonStyles.mt8]}>
                    {bot.pair}
                  </Text>
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

              <View style={commonStyles.row}>
                <Text style={commonStyles.textSecondary}>
                  Created: {bot.created}
                </Text>
                <Icon name="chevron-forward" size={16} style={{ color: colors.textSecondary }} />
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Create Bot Button */}
        <View style={commonStyles.mt16}>
          <Button
            text="Create New Bot"
            onPress={() => router.push('/bots/create')}
            style={[{ backgroundColor: colors.accent, borderRadius: 12, paddingVertical: 16 }]}
            textStyle={{ color: colors.text, fontWeight: '600' }}
          />
        </View>
      </View>
    </View>
  );
}