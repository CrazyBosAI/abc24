import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { router } from 'expo-router';
import { commonStyles, colors } from '../../styles/commonStyles';
import Icon from '../../components/Icon';
import { DrawerActions } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';

interface Order {
  id: string;
  type: 'limit' | 'market' | 'stop-loss' | 'take-profit';
  side: 'buy' | 'sell';
  pair: string;
  amount: number;
  price: number;
  filled: number;
  status: 'open' | 'filled' | 'cancelled' | 'partial';
  date: string;
  botName?: string;
}

export default function OrdersScreen() {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'open' | 'filled' | 'cancelled' | 'partial'>('all');
  const [filterType, setFilterType] = useState<'all' | 'limit' | 'market' | 'stop-loss' | 'take-profit'>('all');

  const [orders, setOrders] = useState<Order[]>([
    {
      id: '1',
      type: 'limit',
      side: 'buy',
      pair: 'BTC/USDT',
      amount: 0.05,
      price: 42500.00,
      filled: 0,
      status: 'open',
      date: '2024-01-20T16:30:00Z',
      botName: 'BTC Long Bot',
    },
    {
      id: '2',
      type: 'market',
      side: 'sell',
      pair: 'ETH/USDT',
      amount: 0.1,
      price: 2680.00,
      filled: 0.1,
      status: 'filled',
      date: '2024-01-20T15:45:00Z',
      botName: 'ETH DCA Bot',
    },
    {
      id: '3',
      type: 'stop-loss',
      side: 'sell',
      pair: 'SOL/USDT',
      amount: 5,
      price: 95.00,
      filled: 0,
      status: 'open',
      date: '2024-01-20T14:20:00Z',
      botName: 'SOL Short Bot',
    },
    {
      id: '4',
      type: 'limit',
      side: 'buy',
      pair: 'ADA/USDT',
      amount: 1000,
      price: 0.50,
      filled: 500,
      status: 'partial',
      date: '2024-01-20T12:10:00Z',
      botName: 'ADA Grid Bot',
    },
    {
      id: '5',
      type: 'take-profit',
      side: 'sell',
      pair: 'BTC/USDT',
      amount: 0.02,
      price: 45000.00,
      filled: 0,
      status: 'cancelled',
      date: '2024-01-19T18:30:00Z',
      botName: 'BTC Long Bot',
    },
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return colors.accentBlue;
      case 'filled':
        return colors.success;
      case 'cancelled':
        return colors.danger;
      case 'partial':
        return colors.warning;
      default:
        return colors.textSecondary;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'limit':
        return colors.accentBlue;
      case 'market':
        return colors.accent;
      case 'stop-loss':
        return colors.danger;
      case 'take-profit':
        return colors.success;
      default:
        return colors.textSecondary;
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.pair.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (order.botName && order.botName.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
    const matchesType = filterType === 'all' || order.type === filterType;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const cancelOrder = (orderId: string) => {
    Alert.alert(
      'Cancel Order',
      'Are you sure you want to cancel this order?',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes',
          style: 'destructive',
          onPress: () => {
            setOrders(prevOrders =>
              prevOrders.map(order =>
                order.id === orderId ? { ...order, status: 'cancelled' as any } : order
              )
            );
            console.log(`Cancelled order ${orderId}`);
          },
        },
      ]
    );
  };

  return (
    <View style={commonStyles.container}>
      <View style={commonStyles.header}>
        <View style={commonStyles.row}>
          <TouchableOpacity onPress={() => navigation.dispatch(DrawerActions.openDrawer())}>
            <Icon name="menu" size={24} style={{ color: colors.text }} />
          </TouchableOpacity>
          <Text style={commonStyles.headerTitle}>Orders</Text>
          <TouchableOpacity onPress={() => console.log('Create manual order')}>
            <Icon name="add" size={24} style={{ color: colors.text }} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={commonStyles.content}>
        {/* Order Statistics */}
        <View style={commonStyles.card}>
          <Text style={[commonStyles.subtitle, commonStyles.mb16]}>Order Statistics</Text>
          
          <View style={[commonStyles.row, commonStyles.mb8]}>
            <Text style={commonStyles.textSecondary}>Total Orders</Text>
            <Text style={[commonStyles.text, { fontWeight: '600' }]}>
              {orders.length}
            </Text>
          </View>

          <View style={[commonStyles.row, commonStyles.mb8]}>
            <Text style={commonStyles.textSecondary}>Open Orders</Text>
            <Text style={[commonStyles.text, { fontWeight: '600', color: colors.accentBlue }]}>
              {orders.filter(o => o.status === 'open').length}
            </Text>
          </View>

          <View style={[commonStyles.row, commonStyles.mb8]}>
            <Text style={commonStyles.textSecondary}>Filled Orders</Text>
            <Text style={[commonStyles.text, { fontWeight: '600', color: colors.success }]}>
              {orders.filter(o => o.status === 'filled').length}
            </Text>
          </View>

          <View style={commonStyles.row}>
            <Text style={commonStyles.textSecondary}>Cancelled Orders</Text>
            <Text style={[commonStyles.text, { fontWeight: '600', color: colors.danger }]}>
              {orders.filter(o => o.status === 'cancelled').length}
            </Text>
          </View>
        </View>

        {/* Search and Filters */}
        <View style={[commonStyles.card, { marginBottom: 16 }]}>
          <View style={[commonStyles.row, { marginBottom: 16 }]}>
            <View style={[commonStyles.flex1, { marginRight: 12 }]}>
              <TextInput
                style={commonStyles.input}
                placeholder="Search orders..."
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
              {['all', 'open', 'filled', 'partial', 'cancelled'].map((status) => (
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
              {['all', 'limit', 'market', 'stop-loss', 'take-profit'].map((type) => (
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
                    {type.replace('-', ' ')}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <View style={[commonStyles.card, { alignItems: 'center', padding: 40 }]}>
            <Icon name="list" size={48} style={{ color: colors.textSecondary, marginBottom: 16 }} />
            <Text style={[commonStyles.text, { marginBottom: 8 }]}>No orders found</Text>
            <Text style={[commonStyles.textSecondary, { textAlign: 'center' }]}>
              {searchQuery || filterStatus !== 'all' || filterType !== 'all' 
                ? 'Try adjusting your search or filters'
                : 'Your orders will appear here'
              }
            </Text>
          </View>
        ) : (
          filteredOrders.map((order) => (
            <View
              key={order.id}
              style={[
                commonStyles.card,
                {
                  borderLeftWidth: 4,
                  borderLeftColor: getStatusColor(order.status),
                }
              ]}
            >
              <View style={[commonStyles.row, commonStyles.mb8]}>
                <View style={commonStyles.flex1}>
                  <View style={[commonStyles.rowCenter, { marginBottom: 4 }]}>
                    <View style={[
                      {
                        backgroundColor: getTypeColor(order.type),
                        paddingHorizontal: 6,
                        paddingVertical: 2,
                        borderRadius: 4,
                        marginRight: 8,
                      }
                    ]}>
                      <Text style={[commonStyles.textSecondary, { fontSize: 10, color: colors.text }]}>
                        {order.type.toUpperCase().replace('-', ' ')}
                      </Text>
                    </View>
                    <View style={[
                      {
                        backgroundColor: order.side === 'buy' ? colors.success : colors.danger,
                        paddingHorizontal: 6,
                        paddingVertical: 2,
                        borderRadius: 4,
                        marginRight: 8,
                      }
                    ]}>
                      <Text style={[commonStyles.textSecondary, { fontSize: 10, color: colors.text }]}>
                        {order.side.toUpperCase()}
                      </Text>
                    </View>
                    <Text style={[commonStyles.text, { fontWeight: '600' }]}>
                      {order.pair}
                    </Text>
                  </View>
                  {order.botName && (
                    <Text style={commonStyles.textSecondary}>{order.botName}</Text>
                  )}
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={[commonStyles.text, { fontWeight: '600' }]}>
                    ${(order.amount * order.price).toLocaleString()}
                  </Text>
                  <View style={commonStyles.rowCenter}>
                    <View style={[
                      {
                        width: 8,
                        height: 8,
                        borderRadius: 4,
                        backgroundColor: getStatusColor(order.status),
                        marginRight: 6,
                      }
                    ]} />
                    <Text style={[commonStyles.textSecondary, { textTransform: 'capitalize' }]}>
                      {order.status}
                    </Text>
                  </View>
                </View>
              </View>

              <View style={[commonStyles.row, commonStyles.mb8]}>
                <Text style={commonStyles.textSecondary}>
                  {order.amount} @ ${order.price.toLocaleString()}
                </Text>
                {order.status === 'partial' && (
                  <Text style={[commonStyles.textSecondary, { color: colors.warning }]}>
                    Filled: {((order.filled / order.amount) * 100).toFixed(1)}%
                  </Text>
                )}
              </View>

              <View style={commonStyles.row}>
                <Text style={[commonStyles.textSecondary, { fontSize: 12 }]}>
                  {new Date(order.date).toLocaleDateString()} {new Date(order.date).toLocaleTimeString()}
                </Text>
                {(order.status === 'open' || order.status === 'partial') && (
                  <TouchableOpacity
                    style={[
                      {
                        backgroundColor: colors.danger,
                        paddingHorizontal: 12,
                        paddingVertical: 4,
                        borderRadius: 4,
                      }
                    ]}
                    onPress={() => cancelOrder(order.id)}
                  >
                    <Text style={[commonStyles.textSecondary, { color: colors.text, fontSize: 12 }]}>
                      Cancel
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}