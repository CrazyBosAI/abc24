import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';
import { router } from 'expo-router';
import { commonStyles, colors } from '../../styles/commonStyles';
import Icon from '../../components/Icon';
import { DrawerActions } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../contexts/AuthContext';

interface SettingItem {
  id: string;
  title: string;
  subtitle?: string;
  type: 'toggle' | 'navigation' | 'action';
  value?: boolean;
  onPress?: () => void;
  onToggle?: (value: boolean) => void;
  icon: keyof typeof import('@expo/vector-icons').Ionicons.glyphMap;
  danger?: boolean;
}

export default function SettingsScreen() {
  const navigation = useNavigation();
  const { user, logout } = useAuth();
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [biometric, setBiometric] = useState(false);
  const [autoTrade, setAutoTrade] = useState(true);
  const [soundEffects, setSoundEffects] = useState(true);

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

  const settingsSections = [
    {
      title: 'Trading',
      items: [
        {
          id: 'auto-trade',
          title: 'Auto Trading',
          subtitle: 'Enable automatic bot trading',
          type: 'toggle' as const,
          value: autoTrade,
          onToggle: setAutoTrade,
          icon: 'robot' as const,
        },
        {
          id: 'risk-management',
          title: 'Risk Management',
          subtitle: 'Configure risk settings',
          type: 'navigation' as const,
          onPress: () => console.log('Navigate to risk management'),
          icon: 'shield-checkmark' as const,
        },
        {
          id: 'api-keys',
          title: 'API Keys',
          subtitle: 'Manage exchange connections',
          type: 'navigation' as const,
          onPress: () => router.push('/(main)/api-credentials'),
          icon: 'key' as const,
        },
      ],
    },
    {
      title: 'Notifications',
      items: [
        {
          id: 'push-notifications',
          title: 'Push Notifications',
          subtitle: 'Receive trade alerts',
          type: 'toggle' as const,
          value: notifications,
          onToggle: setNotifications,
          icon: 'notifications' as const,
        },
        {
          id: 'sound-effects',
          title: 'Sound Effects',
          subtitle: 'Play sounds for events',
          type: 'toggle' as const,
          value: soundEffects,
          onToggle: setSoundEffects,
          icon: 'volume-high' as const,
        },
      ],
    },
    {
      title: 'Security',
      items: [
        {
          id: 'biometric',
          title: 'Biometric Login',
          subtitle: 'Use fingerprint or face ID',
          type: 'toggle' as const,
          value: biometric,
          onToggle: setBiometric,
          icon: 'finger-print' as const,
        },
        {
          id: 'change-password',
          title: 'Change Password',
          subtitle: 'Update your password',
          type: 'navigation' as const,
          onPress: () => console.log('Navigate to change password'),
          icon: 'lock-closed' as const,
        },
        {
          id: 'two-factor',
          title: 'Two-Factor Authentication',
          subtitle: 'Enable 2FA for extra security',
          type: 'navigation' as const,
          onPress: () => console.log('Navigate to 2FA'),
          icon: 'shield' as const,
        },
      ],
    },
    {
      title: 'Appearance',
      items: [
        {
          id: 'dark-mode',
          title: 'Dark Mode',
          subtitle: 'Use dark theme',
          type: 'toggle' as const,
          value: darkMode,
          onToggle: setDarkMode,
          icon: 'moon' as const,
        },
        {
          id: 'language',
          title: 'Language',
          subtitle: 'English',
          type: 'navigation' as const,
          onPress: () => console.log('Navigate to language'),
          icon: 'language' as const,
        },
      ],
    },
    {
      title: 'Support',
      items: [
        {
          id: 'help',
          title: 'Help & Support',
          subtitle: 'Get help and contact support',
          type: 'navigation' as const,
          onPress: () => console.log('Navigate to help'),
          icon: 'help-circle' as const,
        },
        {
          id: 'feedback',
          title: 'Send Feedback',
          subtitle: 'Share your thoughts',
          type: 'navigation' as const,
          onPress: () => console.log('Navigate to feedback'),
          icon: 'chatbubble' as const,
        },
        {
          id: 'about',
          title: 'About',
          subtitle: 'App version and info',
          type: 'navigation' as const,
          onPress: () => console.log('Navigate to about'),
          icon: 'information-circle' as const,
        },
      ],
    },
    {
      title: 'Admin',
      items: user?.email === 'demo@3commas.io' ? [
        {
          id: 'admin-panel',
          title: 'Admin Panel',
          subtitle: 'Manage users and subscriptions',
          type: 'navigation' as const,
          onPress: () => router.push('/admin'),
          icon: 'settings' as const,
        },
      ] : [],
    },
    {
      title: 'Account',
      items: [
        {
          id: 'export-data',
          title: 'Export Data',
          subtitle: 'Download your trading data',
          type: 'action' as const,
          onPress: () => {
            Alert.alert('Export Data', 'Your data export will be ready shortly.');
            console.log('Exporting user data');
          },
          icon: 'download' as const,
        },
        {
          id: 'logout',
          title: 'Logout',
          subtitle: 'Sign out of your account',
          type: 'action' as const,
          onPress: handleLogout,
          icon: 'log-out' as const,
          danger: true,
        },
        {
          id: 'delete-account',
          title: 'Delete Account',
          subtitle: 'Permanently delete your account',
          type: 'action' as const,
          onPress: () => {
            Alert.alert(
              'Delete Account',
              'Are you sure you want to delete your account? This action cannot be undone.',
              [
                { text: 'Cancel', style: 'cancel' },
                {
                  text: 'Delete',
                  style: 'destructive',
                  onPress: () => console.log('Account deletion requested'),
                },
              ]
            );
          },
          icon: 'trash' as const,
          danger: true,
        },
      ],
    },
  ];

  const renderSettingItem = (item: SettingItem) => (
    <TouchableOpacity
      key={item.id}
      style={[
        {
          backgroundColor: colors.secondary,
          borderRadius: 8,
          padding: 16,
          marginBottom: 8,
          flexDirection: 'row',
          alignItems: 'center',
        }
      ]}
      onPress={item.onPress}
      disabled={item.type === 'toggle'}
    >
      <View style={[
        {
          width: 40,
          height: 40,
          borderRadius: 20,
          backgroundColor: item.danger ? colors.danger + '20' : colors.accent + '20',
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: 16,
        }
      ]}>
        <Icon 
          name={item.icon} 
          size={20} 
          style={{ color: item.danger ? colors.danger : colors.accent }} 
        />
      </View>
      
      <View style={[commonStyles.flex1, { marginRight: 12 }]}>
        <Text style={[
          commonStyles.text,
          {
            fontWeight: '600',
            marginBottom: 2,
            color: item.danger ? colors.danger : colors.text,
          }
        ]}>
          {item.title}
        </Text>
        {item.subtitle && (
          <Text style={[commonStyles.textSecondary, { fontSize: 14 }]}>
            {item.subtitle}
          </Text>
        )}
      </View>

      {item.type === 'toggle' ? (
        <Switch
          value={item.value}
          onValueChange={item.onToggle}
          trackColor={{ false: colors.border, true: colors.accent + '50' }}
          thumbColor={item.value ? colors.accent : colors.textSecondary}
        />
      ) : (
        <Icon name="chevron-forward" size={20} style={{ color: colors.textSecondary }} />
      )}
    </TouchableOpacity>
  );

  return (
    <View style={commonStyles.container}>
      <View style={commonStyles.header}>
        <View style={commonStyles.row}>
          <TouchableOpacity onPress={() => navigation.dispatch(DrawerActions.openDrawer())}>
            <Icon name="menu" size={24} style={{ color: colors.text }} />
          </TouchableOpacity>
          <Text style={commonStyles.headerTitle}>Settings</Text>
          <View style={{ width: 24 }} />
        </View>
      </View>

      <ScrollView style={commonStyles.content}>
        {settingsSections.map((section) => {
          // Skip empty sections
          if (section.items.length === 0) return null;
          
          return (
            <View key={section.title} style={commonStyles.card}>
              <Text style={[commonStyles.subtitle, commonStyles.mb16]}>
                {section.title}
              </Text>
              {section.items.map(renderSettingItem)}
            </View>
          );
        })}

        {/* App Version */}
        <View style={[commonStyles.card, { alignItems: 'center' }]}>
          <Text style={[commonStyles.textSecondary, { marginBottom: 8 }]}>
            3Commas Mobile
          </Text>
          <Text style={[commonStyles.textSecondary, { fontSize: 12 }]}>
            Version 1.0.0 (Build 1)
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}