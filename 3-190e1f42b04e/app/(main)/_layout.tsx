import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Drawer } from 'expo-router/drawer';
import { DrawerContentScrollView, DrawerContentComponentProps } from '@react-navigation/drawer';
import { router } from 'expo-router';
import { commonStyles, colors } from '../../styles/commonStyles';
import Icon from '../../components/Icon';
import { useAuth } from '../../contexts/AuthContext';

interface DrawerItem {
  name: string;
  title: string;
  icon: keyof typeof import('@expo/vector-icons').Ionicons.glyphMap;
  route: string;
}

const drawerItems: DrawerItem[] = [
  { name: 'dashboard', title: 'Dashboard', icon: 'grid', route: '/(main)/dashboard' },
  { name: 'bots', title: 'Bots', icon: 'robot', route: '/(main)/bots' },
  { name: 'portfolio', title: 'Portfolio', icon: 'pie-chart', route: '/(main)/portfolio' },
  { name: 'trades', title: 'Trades', icon: 'bar-chart', route: '/(main)/trades' },
  { name: 'orders', title: 'Orders', icon: 'list', route: '/(main)/orders' },
  { name: 'analytics', title: 'Analytics', icon: 'analytics', route: '/(main)/analytics' },
  { name: 'api-credentials', title: 'API Credentials', icon: 'key', route: '/(main)/api-credentials' },
  { name: 'settings', title: 'Settings', icon: 'settings', route: '/(main)/settings' },
];

function CustomDrawerContent(props: DrawerContentComponentProps) {
  const currentRoute = props.state.routes[props.state.index].name;
  const { user, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await logout();
            router.replace('/');
          }
        }
      ]
    );
  };

  return (
    <View style={[commonStyles.container, { backgroundColor: colors.primary }]}>
      <DrawerContentScrollView {...props} contentContainerStyle={{ paddingTop: 0 }}>
        {/* Header */}
        <View style={[
          {
            backgroundColor: colors.background,
            padding: 20,
            borderBottomWidth: 1,
            borderBottomColor: colors.border,
            marginBottom: 20,
          }
        ]}>
          <View style={[commonStyles.rowCenter, { marginBottom: 8 }]}>
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
              <Icon name="trending-up" size={20} style={{ color: colors.text }} />
            </View>
            <Text style={[commonStyles.text, { fontSize: 18, fontWeight: '600' }]}>
              3Commas
            </Text>
          </View>
          <Text style={[commonStyles.textSecondary, { fontSize: 14 }]}>
            {user ? `Welcome, ${user.firstName}` : 'Trading Platform'}
          </Text>
        </View>

        {/* Navigation Items */}
        {drawerItems.map((item) => {
          const isActive = currentRoute === item.name;
          
          return (
            <TouchableOpacity
              key={item.name}
              style={[
                {
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingVertical: 12,
                  paddingHorizontal: 20,
                  marginHorizontal: 10,
                  borderRadius: 8,
                  backgroundColor: isActive ? colors.accent + '20' : 'transparent',
                  borderLeftWidth: isActive ? 3 : 0,
                  borderLeftColor: colors.accent,
                }
              ]}
              onPress={() => router.push(item.route as any)}
            >
              <Icon 
                name={item.icon} 
                size={24} 
                style={{ 
                  color: isActive ? colors.accent : colors.textSecondary,
                  marginRight: 16,
                }} 
              />
              <Text style={[
                commonStyles.text,
                {
                  color: isActive ? colors.accent : colors.text,
                  fontWeight: isActive ? '600' : '400',
                }
              ]}>
                {item.title}
              </Text>
            </TouchableOpacity>
          );
        })}
      </DrawerContentScrollView>

      {/* Footer */}
      <View style={[
        {
          borderTopWidth: 1,
          borderTopColor: colors.border,
          padding: 20,
        }
      ]}>
        <TouchableOpacity
          style={[commonStyles.rowCenter, { marginBottom: 12 }]}
          onPress={() => router.push('/(main)/profile')}
        >
          <Icon name="person-circle" size={24} style={{ color: colors.textSecondary, marginRight: 12 }} />
          <Text style={commonStyles.textSecondary}>Profile</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={commonStyles.rowCenter}
          onPress={handleLogout}
        >
          <Icon name="log-out" size={24} style={{ color: colors.danger, marginRight: 12 }} />
          <Text style={[commonStyles.textSecondary, { color: colors.danger }]}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function MainLayout() {
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!isLoading && !isAuthenticated) {
      router.replace('/auth/login');
    }
  }, [isAuthenticated, isLoading]);

  if (isLoading) {
    return (
      <View style={[commonStyles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Icon name="trending-up" size={60} style={{ color: colors.accent, marginBottom: 16 }} />
        <Text style={commonStyles.text}>Loading...</Text>
      </View>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect to login
  }

  return (
    <Drawer
      drawerContent={CustomDrawerContent}
      screenOptions={{
        headerShown: false,
        drawerStyle: {
          backgroundColor: colors.primary,
          width: 280,
        },
        drawerType: 'front',
        overlayColor: 'rgba(0, 0, 0, 0.5)',
      }}
    >
      <Drawer.Screen name="dashboard" />
      <Drawer.Screen name="bots" />
      <Drawer.Screen name="portfolio" />
      <Drawer.Screen name="trades" />
      <Drawer.Screen name="orders" />
      <Drawer.Screen name="analytics" />
      <Drawer.Screen name="api-credentials" />
      <Drawer.Screen name="settings" />
      <Drawer.Screen name="profile" />
    </Drawer>
  );
}