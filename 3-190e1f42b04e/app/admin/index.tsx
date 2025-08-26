import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert, Platform } from 'react-native';
import { commonStyles, colors } from '../../styles/commonStyles';
import Icon from '../../components/Icon';
import Button from '../../components/Button';
import { router } from 'expo-router';

interface AdminUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  accountType: 'Basic' | 'Pro' | 'Premium';
  status: 'active' | 'suspended' | 'pending';
  memberSince: string;
  lastLogin?: string;
  totalBots: number;
  totalTrades: number;
  totalProfit: number;
}

interface Subscription {
  id: string;
  userId: string;
  userEmail: string;
  plan: 'Basic' | 'Pro' | 'Premium';
  status: 'active' | 'cancelled' | 'expired';
  startDate: string;
  endDate: string;
  amount: number;
  currency: string;
}

const MOCK_USERS: AdminUser[] = [
  {
    id: '1',
    email: 'demo@3commas.io',
    firstName: 'Demo',
    lastName: 'User',
    accountType: 'Pro',
    status: 'active',
    memberSince: '2024-01-01',
    lastLogin: '2024-01-15',
    totalBots: 5,
    totalTrades: 150,
    totalProfit: 2500.50,
  },
  {
    id: '2',
    email: 'john.doe@example.com',
    firstName: 'John',
    lastName: 'Doe',
    accountType: 'Premium',
    status: 'active',
    memberSince: '2023-12-15',
    lastLogin: '2024-01-14',
    totalBots: 12,
    totalTrades: 450,
    totalProfit: 8750.25,
  },
  {
    id: '3',
    email: 'jane.smith@example.com',
    firstName: 'Jane',
    lastName: 'Smith',
    accountType: 'Basic',
    status: 'suspended',
    memberSince: '2024-01-10',
    lastLogin: '2024-01-12',
    totalBots: 2,
    totalTrades: 25,
    totalProfit: -150.75,
  },
];

const MOCK_SUBSCRIPTIONS: Subscription[] = [
  {
    id: '1',
    userId: '1',
    userEmail: 'demo@3commas.io',
    plan: 'Pro',
    status: 'active',
    startDate: '2024-01-01',
    endDate: '2024-02-01',
    amount: 29.99,
    currency: 'USD',
  },
  {
    id: '2',
    userId: '2',
    userEmail: 'john.doe@example.com',
    plan: 'Premium',
    status: 'active',
    startDate: '2023-12-15',
    endDate: '2024-01-15',
    amount: 99.99,
    currency: 'USD',
  },
];

export default function AdminPanelScreen() {
  const [activeTab, setActiveTab] = useState<'users' | 'subscriptions' | 'analytics'>('users');
  const [users, setUsers] = useState<AdminUser[]>(MOCK_USERS);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>(MOCK_SUBSCRIPTIONS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);

  // Check if running on web for admin panel
  useEffect(() => {
    if (Platform.OS !== 'web') {
      Alert.alert(
        'Admin Panel',
        'The admin panel is designed for web browsers. Please access this feature from a web browser.',
        [{ text: 'OK', onPress: () => router.back() }]
      );
    }
  }, []);

  const filteredUsers = users.filter(user =>
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.lastName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return colors.success;
      case 'suspended': return colors.danger;
      case 'pending': return colors.warning;
      case 'cancelled': return colors.danger;
      case 'expired': return colors.textSecondary;
      default: return colors.textSecondary;
    }
  };

  const getAccountTypeColor = (type: string) => {
    switch (type) {
      case 'Premium': return colors.accent;
      case 'Pro': return colors.accentBlue;
      case 'Basic': return colors.textSecondary;
      default: return colors.textSecondary;
    }
  };

  const handleUserAction = (userId: string, action: 'suspend' | 'activate' | 'delete') => {
    Alert.alert(
      'Confirm Action',
      `Are you sure you want to ${action} this user?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          style: action === 'delete' ? 'destructive' : 'default',
          onPress: () => {
            setUsers(prevUsers => {
              if (action === 'delete') {
                return prevUsers.filter(user => user.id !== userId);
              } else {
                return prevUsers.map(user =>
                  user.id === userId
                    ? { ...user, status: action === 'suspend' ? 'suspended' : 'active' }
                    : user
                );
              }
            });
            console.log(`User ${userId} ${action}d`);
          }
        }
      ]
    );
  };

  const renderUserManagement = () => (
    <View>
      {/* Search Bar */}
      <View style={{ marginBottom: 20 }}>
        <TextInput
          style={[commonStyles.input, { paddingLeft: 40 }]}
          placeholder="Search users..."
          placeholderTextColor={colors.textSecondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <Icon
          name="search"
          size={20}
          style={{
            position: 'absolute',
            left: 12,
            top: 16,
            color: colors.textSecondary,
          }}
        />
      </View>

      {/* Users List */}
      <View style={commonStyles.card}>
        <Text style={[commonStyles.subtitle, { marginBottom: 16 }]}>
          Users ({filteredUsers.length})
        </Text>

        {filteredUsers.map((user) => (
          <View key={user.id} style={{
            padding: 16,
            borderBottomWidth: 1,
            borderBottomColor: colors.border,
            marginBottom: 12,
          }}>
            <View style={[commonStyles.row, { marginBottom: 8 }]}>
              <View style={{ flex: 1 }}>
                <Text style={[commonStyles.text, { fontWeight: '600' }]}>
                  {user.firstName} {user.lastName}
                </Text>
                <Text style={commonStyles.textSecondary}>
                  {user.email}
                </Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <View style={{
                  backgroundColor: getAccountTypeColor(user.accountType) + '20',
                  paddingHorizontal: 8,
                  paddingVertical: 4,
                  borderRadius: 4,
                  marginBottom: 4,
                }}>
                  <Text style={[commonStyles.textSecondary, {
                    color: getAccountTypeColor(user.accountType),
                    fontSize: 12,
                    fontWeight: '600',
                  }]}>
                    {user.accountType}
                  </Text>
                </View>
                <Text style={[commonStyles.textSecondary, {
                  color: getStatusColor(user.status),
                  fontSize: 12,
                  fontWeight: '600',
                }]}>
                  {user.status.toUpperCase()}
                </Text>
              </View>
            </View>

            <View style={[commonStyles.row, { marginBottom: 12 }]}>
              <View style={{ flex: 1 }}>
                <Text style={[commonStyles.textSecondary, { fontSize: 12 }]}>
                  Bots: {user.totalBots} • Trades: {user.totalTrades}
                </Text>
                <Text style={[commonStyles.textSecondary, { fontSize: 12 }]}>
                  Profit: ${user.totalProfit.toFixed(2)}
                </Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={[commonStyles.textSecondary, { fontSize: 12 }]}>
                  Member since: {new Date(user.memberSince).toLocaleDateString()}
                </Text>
                {user.lastLogin && (
                  <Text style={[commonStyles.textSecondary, { fontSize: 12 }]}>
                    Last login: {new Date(user.lastLogin).toLocaleDateString()}
                  </Text>
                )}
              </View>
            </View>

            <View style={{ flexDirection: 'row', gap: 8 }}>
              <TouchableOpacity
                style={{
                  flex: 1,
                  backgroundColor: colors.secondary,
                  paddingVertical: 8,
                  paddingHorizontal: 12,
                  borderRadius: 6,
                  alignItems: 'center',
                  borderWidth: 1,
                  borderColor: colors.border,
                }}
                onPress={() => setSelectedUser(user)}
              >
                <Text style={[commonStyles.text, { fontSize: 14 }]}>View</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  flex: 1,
                  backgroundColor: user.status === 'active' ? colors.warning : colors.success,
                  paddingVertical: 8,
                  paddingHorizontal: 12,
                  borderRadius: 6,
                  alignItems: 'center',
                }}
                onPress={() => handleUserAction(user.id, user.status === 'active' ? 'suspend' : 'activate')}
              >
                <Text style={[commonStyles.text, { fontSize: 14 }]}>
                  {user.status === 'active' ? 'Suspend' : 'Activate'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  flex: 1,
                  backgroundColor: colors.danger,
                  paddingVertical: 8,
                  paddingHorizontal: 12,
                  borderRadius: 6,
                  alignItems: 'center',
                }}
                onPress={() => handleUserAction(user.id, 'delete')}
              >
                <Text style={[commonStyles.text, { fontSize: 14 }]}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>
    </View>
  );

  const renderSubscriptionManagement = () => (
    <View>
      <View style={commonStyles.card}>
        <Text style={[commonStyles.subtitle, { marginBottom: 16 }]}>
          Subscriptions ({subscriptions.length})
        </Text>

        {subscriptions.map((subscription) => (
          <View key={subscription.id} style={{
            padding: 16,
            borderBottomWidth: 1,
            borderBottomColor: colors.border,
            marginBottom: 12,
          }}>
            <View style={[commonStyles.row, { marginBottom: 8 }]}>
              <View style={{ flex: 1 }}>
                <Text style={[commonStyles.text, { fontWeight: '600' }]}>
                  {subscription.userEmail}
                </Text>
                <Text style={commonStyles.textSecondary}>
                  {subscription.plan} Plan
                </Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={[commonStyles.text, { fontWeight: '600' }]}>
                  ${subscription.amount}/{subscription.currency}
                </Text>
                <Text style={[commonStyles.textSecondary, {
                  color: getStatusColor(subscription.status),
                  fontSize: 12,
                  fontWeight: '600',
                }]}>
                  {subscription.status.toUpperCase()}
                </Text>
              </View>
            </View>

            <View style={[commonStyles.row, { marginBottom: 12 }]}>
              <Text style={[commonStyles.textSecondary, { fontSize: 12 }]}>
                Start: {new Date(subscription.startDate).toLocaleDateString()}
              </Text>
              <Text style={[commonStyles.textSecondary, { fontSize: 12 }]}>
                End: {new Date(subscription.endDate).toLocaleDateString()}
              </Text>
            </View>

            <View style={{ flexDirection: 'row', gap: 8 }}>
              <TouchableOpacity
                style={{
                  flex: 1,
                  backgroundColor: colors.secondary,
                  paddingVertical: 8,
                  paddingHorizontal: 12,
                  borderRadius: 6,
                  alignItems: 'center',
                  borderWidth: 1,
                  borderColor: colors.border,
                }}
                onPress={() => {
                  Alert.alert('Extend Subscription', 'Extend subscription functionality would be implemented here.');
                }}
              >
                <Text style={[commonStyles.text, { fontSize: 14 }]}>Extend</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  flex: 1,
                  backgroundColor: colors.danger,
                  paddingVertical: 8,
                  paddingHorizontal: 12,
                  borderRadius: 6,
                  alignItems: 'center',
                }}
                onPress={() => {
                  Alert.alert('Cancel Subscription', 'Cancel subscription functionality would be implemented here.');
                }}
              >
                <Text style={[commonStyles.text, { fontSize: 14 }]}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>
    </View>
  );

  const renderAnalytics = () => (
    <View>
      {/* Summary Cards */}
      <View style={{ flexDirection: 'row', gap: 16, marginBottom: 20 }}>
        <View style={[commonStyles.card, { flex: 1 }]}>
          <Text style={[commonStyles.textSecondary, { marginBottom: 4 }]}>Total Users</Text>
          <Text style={[commonStyles.title, { fontSize: 28, color: colors.accent }]}>
            {users.length}
          </Text>
        </View>
        <View style={[commonStyles.card, { flex: 1 }]}>
          <Text style={[commonStyles.textSecondary, { marginBottom: 4 }]}>Active Subscriptions</Text>
          <Text style={[commonStyles.title, { fontSize: 28, color: colors.success }]}>
            {subscriptions.filter(s => s.status === 'active').length}
          </Text>
        </View>
      </View>

      <View style={{ flexDirection: 'row', gap: 16, marginBottom: 20 }}>
        <View style={[commonStyles.card, { flex: 1 }]}>
          <Text style={[commonStyles.textSecondary, { marginBottom: 4 }]}>Total Revenue</Text>
          <Text style={[commonStyles.title, { fontSize: 28, color: colors.accentBlue }]}>
            ${subscriptions.reduce((sum, s) => sum + s.amount, 0).toFixed(2)}
          </Text>
        </View>
        <View style={[commonStyles.card, { flex: 1 }]}>
          <Text style={[commonStyles.textSecondary, { marginBottom: 4 }]}>Total Bots</Text>
          <Text style={[commonStyles.title, { fontSize: 28, color: colors.warning }]}>
            {users.reduce((sum, u) => sum + u.totalBots, 0)}
          </Text>
        </View>
      </View>

      {/* Recent Activity */}
      <View style={commonStyles.card}>
        <Text style={[commonStyles.subtitle, { marginBottom: 16 }]}>Recent Activity</Text>
        <Text style={commonStyles.textSecondary}>
          Recent activity tracking would be implemented with backend integration.
        </Text>
      </View>
    </View>
  );

  return (
    <View style={commonStyles.container}>
      {/* Header */}
      <View style={[commonStyles.header, { paddingBottom: 0 }]}>
        <View style={[commonStyles.row, { marginBottom: 16 }]}>
          <TouchableOpacity onPress={() => router.back()}>
            <Icon name="arrow-back" size={24} style={{ color: colors.text }} />
          </TouchableOpacity>
          <Text style={commonStyles.headerTitle}>Admin Panel</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Tab Navigation */}
        <View style={{ flexDirection: 'row', gap: 4 }}>
          {[
            { key: 'users', title: 'Users', icon: 'people' },
            { key: 'subscriptions', title: 'Subscriptions', icon: 'card' },
            { key: 'analytics', title: 'Analytics', icon: 'analytics' },
          ].map((tab) => (
            <TouchableOpacity
              key={tab.key}
              style={{
                flex: 1,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                paddingVertical: 12,
                paddingHorizontal: 16,
                borderRadius: 8,
                backgroundColor: activeTab === tab.key ? colors.accent : colors.secondary,
              }}
              onPress={() => setActiveTab(tab.key as any)}
            >
              <Icon
                name={tab.icon as any}
                size={16}
                style={{
                  color: activeTab === tab.key ? colors.text : colors.textSecondary,
                  marginRight: 8,
                }}
              />
              <Text style={[
                commonStyles.text,
                {
                  fontSize: 14,
                  fontWeight: activeTab === tab.key ? '600' : '400',
                  color: activeTab === tab.key ? colors.text : colors.textSecondary,
                }
              ]}>
                {tab.title}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <ScrollView style={commonStyles.content}>
        {/* Backend Integration Notice */}
        <View style={[commonStyles.card, { backgroundColor: colors.accentBlue + '20', borderColor: colors.accentBlue + '40', marginBottom: 20 }]}>
          <View style={commonStyles.rowCenter}>
            <Icon name="information-circle" size={24} style={{ color: colors.accentBlue, marginRight: 12 }} />
            <View style={{ flex: 1 }}>
              <Text style={[commonStyles.text, { fontWeight: '600', marginBottom: 4 }]}>
                Backend Integration Required
              </Text>
              <Text style={commonStyles.textSecondary}>
                For full admin panel functionality, please enable Supabase integration to manage real user data, subscriptions, and analytics.
              </Text>
            </View>
          </View>
        </View>

        {/* Tab Content */}
        {activeTab === 'users' && renderUserManagement()}
        {activeTab === 'subscriptions' && renderSubscriptionManagement()}
        {activeTab === 'analytics' && renderAnalytics()}
      </ScrollView>

      {/* User Detail Modal */}
      {selectedUser && (
        <View style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 20,
        }}>
          <View style={[commonStyles.card, { width: '100%', maxWidth: 400 }]}>
            <View style={[commonStyles.row, { marginBottom: 20 }]}>
              <Text style={commonStyles.subtitle}>User Details</Text>
              <TouchableOpacity onPress={() => setSelectedUser(null)}>
                <Icon name="close" size={24} style={{ color: colors.textSecondary }} />
              </TouchableOpacity>
            </View>

            <Text style={[commonStyles.text, { fontWeight: '600', marginBottom: 8 }]}>
              {selectedUser.firstName} {selectedUser.lastName}
            </Text>
            <Text style={[commonStyles.textSecondary, { marginBottom: 16 }]}>
              {selectedUser.email}
            </Text>

            <View style={{ marginBottom: 16 }}>
              <Text style={[commonStyles.textSecondary, { marginBottom: 4 }]}>Account Type</Text>
              <Text style={[commonStyles.text, { color: getAccountTypeColor(selectedUser.accountType) }]}>
                {selectedUser.accountType}
              </Text>
            </View>

            <View style={{ marginBottom: 16 }}>
              <Text style={[commonStyles.textSecondary, { marginBottom: 4 }]}>Status</Text>
              <Text style={[commonStyles.text, { color: getStatusColor(selectedUser.status) }]}>
                {selectedUser.status}
              </Text>
            </View>

            <View style={{ marginBottom: 20 }}>
              <Text style={[commonStyles.textSecondary, { marginBottom: 4 }]}>Statistics</Text>
              <Text style={commonStyles.text}>Bots: {selectedUser.totalBots}</Text>
              <Text style={commonStyles.text}>Trades: {selectedUser.totalTrades}</Text>
              <Text style={commonStyles.text}>Profit: ${selectedUser.totalProfit.toFixed(2)}</Text>
            </View>

            <Button
              text="Close"
              onPress={() => setSelectedUser(null)}
              style={{ backgroundColor: colors.secondary, borderWidth: 1, borderColor: colors.border }}
              textStyle={{ color: colors.text }}
            />
          </View>
        </View>
      )}
    </View>
  );
}