import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { router } from 'expo-router';
import { commonStyles, colors } from '../../styles/commonStyles';
import Icon from '../../components/Icon';
import Button from '../../components/Button';

interface BotConfig {
  name: string;
  type: 'DCA' | 'Grid' | 'Long' | 'Short';
  pair: string;
  baseOrderSize: string;
  safetyOrderSize: string;
  maxSafetyTrades: string;
  priceDeviation: string;
  safetyOrderStepScale: string;
  safetyOrderVolumeScale: string;
  takeProfit: string;
  stopLoss: string;
}

export default function CreateBotScreen() {
  const [botConfig, setBotConfig] = useState<BotConfig>({
    name: '',
    type: 'DCA',
    pair: 'BTC/USDT',
    baseOrderSize: '100',
    safetyOrderSize: '200',
    maxSafetyTrades: '5',
    priceDeviation: '2.5',
    safetyOrderStepScale: '1.2',
    safetyOrderVolumeScale: '1.5',
    takeProfit: '3.0',
    stopLoss: '10.0',
  });

  const botTypes = [
    { id: 'DCA', name: 'DCA Bot', description: 'Dollar Cost Averaging' },
    { id: 'Grid', name: 'Grid Bot', description: 'Grid Trading Strategy' },
    { id: 'Long', name: 'Long Bot', description: 'Long Position Bot' },
    { id: 'Short', name: 'Short Bot', description: 'Short Position Bot' },
  ];

  const popularPairs = [
    'BTC/USDT', 'ETH/USDT', 'ADA/USDT', 'SOL/USDT',
    'DOT/USDT', 'LINK/USDT', 'MATIC/USDT', 'AVAX/USDT'
  ];

  const updateConfig = (key: keyof BotConfig, value: string) => {
    setBotConfig(prev => ({ ...prev, [key]: value }));
  };

  const validateAndCreateBot = () => {
    if (!botConfig.name.trim()) {
      Alert.alert('Error', 'Please enter a bot name');
      return;
    }

    if (!botConfig.pair) {
      Alert.alert('Error', 'Please select a trading pair');
      return;
    }

    // Simulate bot creation
    Alert.alert(
      'Bot Created',
      `${botConfig.name} has been created successfully!`,
      [
        { text: 'OK', onPress: () => router.back() }
      ]
    );
  };

  const renderInput = (
    label: string,
    key: keyof BotConfig,
    placeholder: string,
    suffix?: string,
    keyboardType: 'default' | 'numeric' = 'default'
  ) => (
    <View style={commonStyles.mb16}>
      <Text style={[commonStyles.text, { fontWeight: '600', marginBottom: 8 }]}>
        {label}
      </Text>
      <View style={{ position: 'relative' }}>
        <TextInput
          style={[commonStyles.input, suffix && { paddingRight: 50 }]}
          placeholder={placeholder}
          placeholderTextColor={colors.textSecondary}
          value={botConfig[key]}
          onChangeText={(value) => updateConfig(key, value)}
          keyboardType={keyboardType}
        />
        {suffix && (
          <Text style={[
            commonStyles.textSecondary,
            {
              position: 'absolute',
              right: 12,
              top: 12,
              fontSize: 16,
            }
          ]}>
            {suffix}
          </Text>
        )}
      </View>
    </View>
  );

  return (
    <View style={commonStyles.container}>
      <View style={commonStyles.header}>
        <View style={commonStyles.row}>
          <TouchableOpacity onPress={() => router.back()}>
            <Icon name="arrow-back" size={24} style={{ color: colors.text }} />
          </TouchableOpacity>
          <Text style={commonStyles.headerTitle}>Create Bot</Text>
          <View style={{ width: 24 }} />
        </View>
      </View>

      <ScrollView style={commonStyles.content} showsVerticalScrollIndicator={false}>
        {/* Bot Name */}
        <View style={commonStyles.card}>
          <Text style={[commonStyles.subtitle, commonStyles.mb16]}>Bot Configuration</Text>
          
          {renderInput('Bot Name', 'name', 'Enter bot name')}

          {/* Bot Type Selection */}
          <Text style={[commonStyles.text, { fontWeight: '600', marginBottom: 8 }]}>
            Bot Type
          </Text>
          <View style={[{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 16 }]}>
            {botTypes.map((type) => (
              <TouchableOpacity
                key={type.id}
                style={[
                  {
                    paddingVertical: 12,
                    paddingHorizontal: 16,
                    borderRadius: 8,
                    backgroundColor: botConfig.type === type.id ? colors.accent : colors.secondary,
                    marginRight: 8,
                    marginBottom: 8,
                    borderWidth: 1,
                    borderColor: botConfig.type === type.id ? colors.accent : colors.border,
                  }
                ]}
                onPress={() => updateConfig('type', type.id as any)}
              >
                <Text style={[
                  commonStyles.text,
                  { fontWeight: '600', fontSize: 14 },
                  botConfig.type === type.id && { color: colors.text }
                ]}>
                  {type.name}
                </Text>
                <Text style={[
                  commonStyles.textSecondary,
                  { fontSize: 12 },
                  botConfig.type === type.id && { color: colors.text, opacity: 0.8 }
                ]}>
                  {type.description}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Trading Pair */}
          <Text style={[commonStyles.text, { fontWeight: '600', marginBottom: 8 }]}>
            Trading Pair
          </Text>
          <View style={[{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 16 }]}>
            {popularPairs.map((pair) => (
              <TouchableOpacity
                key={pair}
                style={[
                  {
                    paddingVertical: 8,
                    paddingHorizontal: 12,
                    borderRadius: 16,
                    backgroundColor: botConfig.pair === pair ? colors.accent : colors.secondary,
                    marginRight: 8,
                    marginBottom: 8,
                  }
                ]}
                onPress={() => updateConfig('pair', pair)}
              >
                <Text style={[
                  commonStyles.textSecondary,
                  { fontSize: 14 },
                  botConfig.pair === pair && { color: colors.text, fontWeight: '600' }
                ]}>
                  {pair}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Order Settings */}
        <View style={commonStyles.card}>
          <Text style={[commonStyles.subtitle, commonStyles.mb16]}>Order Settings</Text>
          
          {renderInput('Base Order Size', 'baseOrderSize', '100', 'USDT', 'numeric')}
          {renderInput('Safety Order Size', 'safetyOrderSize', '200', 'USDT', 'numeric')}
          {renderInput('Max Safety Trades', 'maxSafetyTrades', '5', '', 'numeric')}
          {renderInput('Price Deviation', 'priceDeviation', '2.5', '%', 'numeric')}
        </View>

        {/* Advanced Settings */}
        <View style={commonStyles.card}>
          <Text style={[commonStyles.subtitle, commonStyles.mb16]}>Advanced Settings</Text>
          
          {renderInput('Safety Order Step Scale', 'safetyOrderStepScale', '1.2', '', 'numeric')}
          {renderInput('Safety Order Volume Scale', 'safetyOrderVolumeScale', '1.5', '', 'numeric')}
          {renderInput('Take Profit', 'takeProfit', '3.0', '%', 'numeric')}
          {renderInput('Stop Loss', 'stopLoss', '10.0', '%', 'numeric')}
        </View>

        {/* Risk Warning */}
        <View style={[commonStyles.card, { backgroundColor: colors.danger, opacity: 0.1 }]}>
          <View style={commonStyles.rowCenter}>
            <Icon name="warning" size={24} style={{ color: colors.danger, marginRight: 12 }} />
            <View style={commonStyles.flex1}>
              <Text style={[commonStyles.text, { color: colors.danger, fontWeight: '600' }]}>
                Risk Warning
              </Text>
              <Text style={[commonStyles.textSecondary, { color: colors.danger }]}>
                Trading bots involve significant risk. Only invest what you can afford to lose.
              </Text>
            </View>
          </View>
        </View>

        {/* Create Button */}
        <View style={commonStyles.mt16}>
          <Button
            text="Create Bot"
            onPress={validateAndCreateBot}
            style={[{ backgroundColor: colors.accent, borderRadius: 12, paddingVertical: 16 }]}
            textStyle={{ color: colors.text, fontWeight: '600', fontSize: 18 }}
          />
        </View>

        <View style={{ height: 32 }} />
      </ScrollView>
    </View>
  );
}