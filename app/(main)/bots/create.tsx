import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { router } from 'expo-router';
import { commonStyles, colors } from '../../../styles/commonStyles';
import Icon from '../../../components/Icon';
import Button from '../../../components/Button';

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

const botTypes = [
  { 
    type: 'DCA' as const, 
    title: 'DCA Bot', 
    description: 'Dollar Cost Averaging strategy',
    icon: 'trending-down' as const,
    color: colors.accentBlue,
  },
  { 
    type: 'Grid' as const, 
    title: 'Grid Bot', 
    description: 'Grid trading strategy',
    icon: 'grid' as const,
    color: colors.warning,
  },
  { 
    type: 'Long' as const, 
    title: 'Long Bot', 
    description: 'Long position strategy',
    icon: 'trending-up' as const,
    color: colors.success,
  },
  { 
    type: 'Short' as const, 
    title: 'Short Bot', 
    description: 'Short position strategy',
    icon: 'trending-down' as const,
    color: colors.danger,
  },
];

const popularPairs = [
  'BTC/USDT', 'ETH/USDT', 'BNB/USDT', 'ADA/USDT', 
  'SOL/USDT', 'DOT/USDT', 'MATIC/USDT', 'AVAX/USDT'
];

export default function CreateBotScreen() {
  const [config, setConfig] = useState<BotConfig>({
    name: '',
    type: 'DCA',
    pair: '',
    baseOrderSize: '',
    safetyOrderSize: '',
    maxSafetyTrades: '',
    priceDeviation: '',
    safetyOrderStepScale: '',
    safetyOrderVolumeScale: '',
    takeProfit: '',
    stopLoss: '',
  });

  const [step, setStep] = useState(1);

  const updateConfig = (key: keyof BotConfig, value: string) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  const validateAndCreateBot = () => {
    console.log('Creating bot with config:', config);
    
    if (!config.name.trim()) {
      Alert.alert('Error', 'Please enter a bot name');
      return;
    }
    
    if (!config.pair.trim()) {
      Alert.alert('Error', 'Please select a trading pair');
      return;
    }
    
    if (!config.baseOrderSize.trim() || isNaN(Number(config.baseOrderSize))) {
      Alert.alert('Error', 'Please enter a valid base order size');
      return;
    }

    Alert.alert(
      'Bot Created',
      `${config.name} has been created successfully!`,
      [
        {
          text: 'View Bots',
          onPress: () => router.push('/(main)/bots'),
        },
        {
          text: 'Create Another',
          onPress: () => {
            setConfig({
              name: '',
              type: 'DCA',
              pair: '',
              baseOrderSize: '',
              safetyOrderSize: '',
              maxSafetyTrades: '',
              priceDeviation: '',
              safetyOrderStepScale: '',
              safetyOrderVolumeScale: '',
              takeProfit: '',
              stopLoss: '',
            });
            setStep(1);
          },
        },
      ]
    );
  };

  const renderInput = (
    label: string, 
    key: keyof BotConfig, 
    placeholder: string, 
    keyboardType: 'default' | 'numeric' = 'default'
  ) => (
    <View style={commonStyles.mb16}>
      <Text style={[commonStyles.textSecondary, commonStyles.mb8]}>{label}</Text>
      <TextInput
        style={commonStyles.input}
        placeholder={placeholder}
        placeholderTextColor={colors.textSecondary}
        value={config[key]}
        onChangeText={(value) => updateConfig(key, value)}
        keyboardType={keyboardType}
      />
    </View>
  );

  const renderStepIndicator = () => (
    <View style={[commonStyles.row, { marginBottom: 24 }]}>
      {[1, 2, 3].map((stepNumber) => (
        <View key={stepNumber} style={[commonStyles.rowCenter, commonStyles.flex1]}>
          <View style={[
            {
              width: 32,
              height: 32,
              borderRadius: 16,
              backgroundColor: step >= stepNumber ? colors.accent : colors.secondary,
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: stepNumber < 3 ? 8 : 0,
            }
          ]}>
            <Text style={[
              commonStyles.textSecondary,
              { 
                color: step >= stepNumber ? colors.text : colors.textSecondary,
                fontWeight: '600',
              }
            ]}>
              {stepNumber}
            </Text>
          </View>
          {stepNumber < 3 && (
            <View style={[
              {
                flex: 1,
                height: 2,
                backgroundColor: step > stepNumber ? colors.accent : colors.secondary,
                marginLeft: 8,
              }
            ]} />
          )}
        </View>
      ))}
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

      <ScrollView style={commonStyles.content}>
        {renderStepIndicator()}

        {step === 1 && (
          <View>
            <Text style={[commonStyles.title, commonStyles.mb16]}>Choose Bot Type</Text>
            
            {botTypes.map((botType) => (
              <TouchableOpacity
                key={botType.type}
                style={[
                  commonStyles.card,
                  {
                    borderWidth: 2,
                    borderColor: config.type === botType.type ? botType.color : colors.border,
                    backgroundColor: config.type === botType.type ? botType.color + '10' : colors.card,
                  }
                ]}
                onPress={() => updateConfig('type', botType.type)}
              >
                <View style={commonStyles.rowCenter}>
                  <View style={[
                    {
                      width: 48,
                      height: 48,
                      borderRadius: 24,
                      backgroundColor: botType.color,
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginRight: 16,
                    }
                  ]}>
                    <Icon name={botType.icon} size={24} style={{ color: colors.text }} />
                  </View>
                  <View style={commonStyles.flex1}>
                    <Text style={[commonStyles.text, { fontWeight: '600', marginBottom: 4 }]}>
                      {botType.title}
                    </Text>
                    <Text style={commonStyles.textSecondary}>
                      {botType.description}
                    </Text>
                  </View>
                  {config.type === botType.type && (
                    <Icon name="checkmark-circle" size={24} style={{ color: botType.color }} />
                  )}
                </View>
              </TouchableOpacity>
            ))}

            <Button
              text="Next"
              onPress={() => setStep(2)}
              style={[{ backgroundColor: colors.accent, marginTop: 24 }]}
            />
          </View>
        )}

        {step === 2 && (
          <View>
            <Text style={[commonStyles.title, commonStyles.mb16]}>Basic Configuration</Text>
            
            {renderInput('Bot Name', 'name', 'Enter bot name')}
            
            <View style={commonStyles.mb16}>
              <Text style={[commonStyles.textSecondary, commonStyles.mb8]}>Trading Pair</Text>
              <TextInput
                style={commonStyles.input}
                placeholder="Enter trading pair (e.g., BTC/USDT)"
                placeholderTextColor={colors.textSecondary}
                value={config.pair}
                onChangeText={(value) => updateConfig('pair', value.toUpperCase())}
              />
              
              <Text style={[commonStyles.textSecondary, { fontSize: 12, marginTop: 8 }]}>
                Popular pairs:
              </Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 8 }}>
                {popularPairs.map((pair) => (
                  <TouchableOpacity
                    key={pair}
                    style={[
                      {
                        backgroundColor: config.pair === pair ? colors.accent : colors.secondary,
                        paddingHorizontal: 12,
                        paddingVertical: 6,
                        borderRadius: 16,
                        marginRight: 8,
                      }
                    ]}
                    onPress={() => updateConfig('pair', pair)}
                  >
                    <Text style={[
                      commonStyles.textSecondary,
                      {
                        color: config.pair === pair ? colors.text : colors.textSecondary,
                        fontSize: 12,
                      }
                    ]}>
                      {pair}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {renderInput('Base Order Size ($)', 'baseOrderSize', '100', 'numeric')}
            {renderInput('Take Profit (%)', 'takeProfit', '2.5', 'numeric')}

            <View style={[commonStyles.row, { marginTop: 24 }]}>
              <Button
                text="Back"
                onPress={() => setStep(1)}
                style={[{ backgroundColor: colors.secondary, flex: 1, marginRight: 8 }]}
              />
              <Button
                text="Next"
                onPress={() => setStep(3)}
                style={[{ backgroundColor: colors.accent, flex: 1, marginLeft: 8 }]}
              />
            </View>
          </View>
        )}

        {step === 3 && (
          <View>
            <Text style={[commonStyles.title, commonStyles.mb16]}>Advanced Settings</Text>
            
            {config.type === 'DCA' && (
              <>
                {renderInput('Safety Order Size ($)', 'safetyOrderSize', '200', 'numeric')}
                {renderInput('Max Safety Trades', 'maxSafetyTrades', '5', 'numeric')}
                {renderInput('Price Deviation (%)', 'priceDeviation', '2.5', 'numeric')}
                {renderInput('Safety Order Step Scale', 'safetyOrderStepScale', '1.05', 'numeric')}
                {renderInput('Safety Order Volume Scale', 'safetyOrderVolumeScale', '1.05', 'numeric')}
              </>
            )}

            {config.type === 'Grid' && (
              <>
                {renderInput('Grid Levels', 'maxSafetyTrades', '10', 'numeric')}
                {renderInput('Grid Spacing (%)', 'priceDeviation', '1.0', 'numeric')}
                {renderInput('Upper Price Limit', 'safetyOrderStepScale', '50000', 'numeric')}
                {renderInput('Lower Price Limit', 'safetyOrderVolumeScale', '40000', 'numeric')}
              </>
            )}

            {(config.type === 'Long' || config.type === 'Short') && (
              <>
                {renderInput('Leverage', 'maxSafetyTrades', '2', 'numeric')}
                {renderInput('Stop Loss (%)', 'stopLoss', '5.0', 'numeric')}
              </>
            )}

            <View style={[commonStyles.row, { marginTop: 24 }]}>
              <Button
                text="Back"
                onPress={() => setStep(2)}
                style={[{ backgroundColor: colors.secondary, flex: 1, marginRight: 8 }]}
              />
              <Button
                text="Create Bot"
                onPress={validateAndCreateBot}
                style={[{ backgroundColor: colors.success, flex: 1, marginLeft: 8 }]}
              />
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}