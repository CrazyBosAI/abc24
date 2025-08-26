import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';
import { router } from 'expo-router';
import { commonStyles, colors } from '../styles/commonStyles';
import Icon from '../components/Icon';

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
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [biometric, setBiometric] = useState(false);
  const [autoTrade, setAutoTrade] = useState(true);

  const settingSections = [
    {
      title: 'Account',
      items: [
        {
          id: 'profile',
          title: 'Profile Settings',
          subtitle: 'Manage your account information',
          type: 'navigation',
          icon: 'person',
          onPress: () => console.log('Navigate to profile'),
        },
        {
          id: 'api',
          title: 'API Keys',
          subtitle: 'Manage exchange connections',
          type: 'navigation',
          icon: 'key',
          onPress: () => console.log('Navigate to API keys'),
        },
        {
          id: 'subscription',
          title: 'Subscription',
          subtitle: 'Pro Plan - Active',
          type: 'navigation',
          icon: 'card',
          onPress: () => console.log('Navigate to subscription'),
        },
      ] as SettingItem[],
    },
    {
      title: 'Trading',
      items: [
        {
          id: 'autoTrade',
          title: 'Auto Trading',
          subtitle: 'Enable automatic bot execution',
          type: 'toggle',
          icon: 'play',
          value: autoTrade,
          onToggle: setAutoTrade,
        },
        {
          id: 'riskManagement',
          title: 'Risk Management',
          subtitle: 'Configure safety settings',
          type: 'navigation',
          icon: 'shield',
          onPress: () => console.log('Navigate to risk management'),
        },
        {
          id: 'tradingPairs',
          title: 'Trading Pairs',
          subtitle: 'Manage allowed pairs',
          type: 'navigation',
          icon: 'swap-horizontal',
          onPress: () => console.log('Navigate to trading pairs'),
        },
      ] as SettingItem[],
    },
    {
      title: 'App Settings',
      items: [
        {
          id: 'notifications',
          title: 'Push Notifications',
          subtitle: 'Receive trade alerts',
          type: 'toggle',
          icon: 'notifications',
          value: notifications,
          onToggle: setNotifications,
        },
        {
          id: 'darkMode',
          title: 'Dark Mode',
          subtitle: 'Use dark theme',
          type: 'toggle',
          icon: 'moon',
          value: darkMode,
          onToggle: setDarkMode,
        },
        {
          id: 'biometric',
          title: 'Biometric Login',
          subtitle: 'Use fingerprint/face ID',
          type: 'toggle',
          icon: 'finger-print',
          value: biometric,
          onToggle: setBiometric,
        },
        {
          id: 'language',
          title: 'Language',
          subtitle: 'English',
          type: 'navigation',
          icon: 'language',
          onPress: () => console.log('Navigate to language'),
        },
      ] as SettingItem[],
    },
    {
      title: 'Support',
      items: [
        {
          id: 'help',
          title: 'Help Center',
          subtitle: 'Get support and tutorials',
          type: 'navigation',
          icon: 'help-circle',
          onPress: () => console.log('Navigate to help'),
        },
        {
          id: 'feedback',
          title: 'Send Feedback',
          subtitle: 'Help us improve the app',
          type: 'navigation',
          icon: 'chatbubble',
          onPress: () => console.log('Navigate to feedback'),
        },
        {
          id: 'about',
          title: 'About',
          subtitle: 'Version 1.0.0',
          type: 'navigation',
          icon: 'information-circle',
          onPress: () => console.log('Navigate to about'),
        },
      ] as SettingItem[],
    },
    {
      title: 'Account Actions',
      items: [
        {
          id: 'logout',
          title: 'Sign Out',
          type: 'action',
          icon: 'log-out',
          danger: true,
          onPress: () => {
            Alert.alert(
              'Sign Out',
              'Are you sure you want to sign out?',
              [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Sign Out', style: 'destructive', onPress: () => router.replace('/') },
              ]
            );
          },
        },
      ] as SettingItem[],
    },
  ];

  const renderSettingItem = (item: SettingItem) => {
    return (
      <TouchableOpacity
        key={item.id}
        style={[
          {
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: 16,
            paddingHorizontal: 16,
            backgroundColor: colors.card,
            marginBottom: 1,
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
            backgroundColor: item.danger ? colors.danger : colors.accent,
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 16,
          }
        ]}>
          <Icon name={item.icon} size={20} style={{ color: colors.text }} />
        </View>

        <View style={commonStyles.flex1}>
          <Text style={[commonStyles.text, { fontWeight: '600' }]}>
            {item.title}
          </Text>
          {item.subtitle && (
            <Text style={[commonStyles.textSecondary, { fontSize: 14 }]}>
              {item.subtitle}
            </Text>
          )}
        </View>

        {item.type === 'toggle' && (
          <Switch
            value={item.value}
            onValueChange={item.onToggle}
            trackColor={{ false: colors.border, true: colors.accent }}
            thumbColor={colors.text}
          />
        )}

        {item.type === 'navigation' && (
          <Icon name="chevron-forward" size={20} style={{ color: colors.textSecondary }} />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={commonStyles.container}>
      <View style={commonStyles.header}>
        <View style={commonStyles.row}>
          <TouchableOpacity onPress={() => router.back()}>
            <Icon name="arrow-back" size={24} style={{ color: colors.text }} />
          </TouchableOpacity>
          <Text style={commonStyles.headerTitle}>Settings</Text>
          <View style={{ width: 24 }} />
        </View>
      </View>

      <ScrollView style={commonStyles.content} showsVerticalScrollIndicator={false}>
        {settingSections.map((section, sectionIndex) => (
          <View key={section.title} style={commonStyles.mb16}>
            <Text style={[commonStyles.textSecondary, { fontSize: 14, fontWeight: '600', marginBottom: 8, marginLeft: 16 }]}>
              {section.title.toUpperCase()}
            </Text>
            <View style={{ borderRadius: 12, overflow: 'hidden' }}>
              {section.items.map((item) => renderSettingItem(item))}
            </View>
          </View>
        ))}

        <View style={{ height: 32 }} />
      </ScrollView>
    </View>
  );
}