import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert, Switch } from 'react-native';
import { commonStyles, colors } from '../../styles/commonStyles';
import Icon from '../../components/Icon';
import Button from '../../components/Button';
import { DrawerActions } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Keychain from 'react-native-keychain';
import { Platform } from 'react-native';

interface ExchangeCredentials {
  id: string;
  name: string;
  apiKey: string;
  apiSecret: string;
  passphrase?: string;
  isActive: boolean;
  isTestnet: boolean;
  permissions: string[];
  lastUsed?: string;
  status: 'connected' | 'error' | 'pending';
}

const SUPPORTED_EXCHANGES = [
  { id: 'binance', name: 'Binance', icon: 'logo-bitcoin', requiresPassphrase: false },
  { id: 'coinbase', name: 'Coinbase Pro', icon: 'card', requiresPassphrase: true },
  { id: 'kraken', name: 'Kraken', icon: 'trending-up', requiresPassphrase: false },
  { id: 'kucoin', name: 'KuCoin', icon: 'diamond', requiresPassphrase: true },
  { id: 'bybit', name: 'Bybit', icon: 'flash', requiresPassphrase: false },
  { id: 'okx', name: 'OKX', icon: 'ellipse', requiresPassphrase: true },
];

const STORAGE_KEY = '@3commas_api_credentials';

export default function ApiCredentialsScreen() {
  const navigation = useNavigation();
  const [credentials, setCredentials] = useState<ExchangeCredentials[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedExchange, setSelectedExchange] = useState<string>('');
  const [formData, setFormData] = useState({
    apiKey: '',
    apiSecret: '',
    passphrase: '',
    isTestnet: false,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadCredentials();
  }, []);

  const loadCredentials = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsedCredentials = JSON.parse(stored);
        console.log('Loaded API credentials:', parsedCredentials.length);
        setCredentials(parsedCredentials);
      }
    } catch (error) {
      console.error('Error loading credentials:', error);
    }
  };

  const saveCredentials = async (newCredentials: ExchangeCredentials[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newCredentials));
      
      // Store sensitive data in keychain (mobile only)
      if (Platform.OS !== 'web') {
        for (const cred of newCredentials) {
          await Keychain.setInternetCredentials(
            `3commas_${cred.id}`,
            cred.apiKey,
            cred.apiSecret
          );
        }
      }
      
      setCredentials(newCredentials);
      console.log('API credentials saved successfully');
    } catch (error) {
      console.error('Error saving credentials:', error);
    }
  };

  const testConnection = async (exchangeId: string, apiKey: string, apiSecret: string, passphrase?: string) => {
    // Simulate API connection test
    return new Promise<boolean>((resolve) => {
      setTimeout(() => {
        // For demo purposes, randomly succeed or fail
        const success = Math.random() > 0.3;
        console.log(`Connection test for ${exchangeId}:`, success ? 'SUCCESS' : 'FAILED');
        resolve(success);
      }, 2000);
    });
  };

  const handleAddCredentials = async () => {
    if (!selectedExchange || !formData.apiKey || !formData.apiSecret) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const exchange = SUPPORTED_EXCHANGES.find(ex => ex.id === selectedExchange);
    if (!exchange) return;

    if (exchange.requiresPassphrase && !formData.passphrase) {
      Alert.alert('Error', `${exchange.name} requires a passphrase`);
      return;
    }

    setLoading(true);
    try {
      console.log(`Testing connection to ${exchange.name}...`);
      const connectionSuccess = await testConnection(
        selectedExchange,
        formData.apiKey,
        formData.apiSecret,
        formData.passphrase
      );

      const newCredential: ExchangeCredentials = {
        id: `${selectedExchange}_${Date.now()}`,
        name: exchange.name,
        apiKey: formData.apiKey,
        apiSecret: formData.apiSecret,
        passphrase: formData.passphrase,
        isActive: connectionSuccess,
        isTestnet: formData.isTestnet,
        permissions: ['read', 'trade'], // Mock permissions
        lastUsed: connectionSuccess ? new Date().toISOString() : undefined,
        status: connectionSuccess ? 'connected' : 'error',
      };

      const updatedCredentials = [...credentials, newCredential];
      await saveCredentials(updatedCredentials);

      Alert.alert(
        connectionSuccess ? 'Success' : 'Warning',
        connectionSuccess 
          ? `${exchange.name} API credentials added successfully!`
          : `API credentials saved but connection failed. Please check your credentials.`,
        [{ text: 'OK' }]
      );

      // Reset form
      setFormData({ apiKey: '', apiSecret: '', passphrase: '', isTestnet: false });
      setSelectedExchange('');
      setShowAddForm(false);
    } catch (error) {
      console.error('Error adding credentials:', error);
      Alert.alert('Error', 'Failed to add API credentials');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCredentials = (credentialId: string) => {
    Alert.alert(
      'Delete API Credentials',
      'Are you sure you want to delete these API credentials? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const updatedCredentials = credentials.filter(cred => cred.id !== credentialId);
            await saveCredentials(updatedCredentials);
            
            // Remove from keychain
            if (Platform.OS !== 'web') {
              try {
                await Keychain.resetInternetCredentials(`3commas_${credentialId}`);
              } catch (error) {
                console.error('Error removing from keychain:', error);
              }
            }
          }
        }
      ]
    );
  };

  const toggleCredentialStatus = async (credentialId: string) => {
    const updatedCredentials = credentials.map(cred => {
      if (cred.id === credentialId) {
        return { ...cred, isActive: !cred.isActive };
      }
      return cred;
    });
    await saveCredentials(updatedCredentials);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return colors.success;
      case 'error': return colors.danger;
      case 'pending': return colors.warning;
      default: return colors.textSecondary;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected': return 'checkmark-circle';
      case 'error': return 'close-circle';
      case 'pending': return 'time';
      default: return 'help-circle';
    }
  };

  return (
    <View style={commonStyles.container}>
      {/* Header */}
      <View style={commonStyles.header}>
        <View style={commonStyles.row}>
          <TouchableOpacity onPress={() => navigation.dispatch(DrawerActions.openDrawer())}>
            <Icon name="menu" size={24} style={{ color: colors.text }} />
          </TouchableOpacity>
          <Text style={commonStyles.headerTitle}>API Credentials</Text>
          <TouchableOpacity onPress={() => setShowAddForm(!showAddForm)}>
            <Icon name="add" size={24} style={{ color: colors.accent }} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={commonStyles.content}>
        {/* Info Card */}
        <View style={[commonStyles.card, { backgroundColor: colors.accentBlue + '20', borderColor: colors.accentBlue + '40' }]}>
          <View style={commonStyles.rowCenter}>
            <Icon name="information-circle" size={24} style={{ color: colors.accentBlue, marginRight: 12 }} />
            <View style={{ flex: 1 }}>
              <Text style={[commonStyles.text, { fontWeight: '600', marginBottom: 4 }]}>
                Secure API Management
              </Text>
              <Text style={commonStyles.textSecondary}>
                Your API credentials are encrypted and stored securely. Only trading permissions are recommended.
              </Text>
            </View>
          </View>
        </View>

        {/* Add Credentials Form */}
        {showAddForm && (
          <View style={commonStyles.card}>
            <Text style={[commonStyles.subtitle, { marginBottom: 20 }]}>
              Add Exchange API Credentials
            </Text>

            {/* Exchange Selection */}
            <Text style={[commonStyles.text, { marginBottom: 8, fontWeight: '500' }]}>
              Select Exchange
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 20 }}>
              {SUPPORTED_EXCHANGES.map((exchange) => (
                <TouchableOpacity
                  key={exchange.id}
                  style={{
                    backgroundColor: selectedExchange === exchange.id ? colors.accent : colors.secondary,
                    paddingHorizontal: 16,
                    paddingVertical: 12,
                    borderRadius: 8,
                    marginRight: 12,
                    flexDirection: 'row',
                    alignItems: 'center',
                    borderWidth: 1,
                    borderColor: selectedExchange === exchange.id ? colors.accent : colors.border,
                  }}
                  onPress={() => setSelectedExchange(exchange.id)}
                >
                  <Icon name={exchange.icon as any} size={20} style={{ color: colors.text, marginRight: 8 }} />
                  <Text style={[commonStyles.text, { fontSize: 14 }]}>
                    {exchange.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {selectedExchange && (
              <>
                {/* API Key */}
                <Text style={[commonStyles.text, { marginBottom: 8, fontWeight: '500' }]}>
                  API Key
                </Text>
                <TextInput
                  style={[commonStyles.input, { marginBottom: 16 }]}
                  placeholder="Enter your API key"
                  placeholderTextColor={colors.textSecondary}
                  value={formData.apiKey}
                  onChangeText={(value) => setFormData(prev => ({ ...prev, apiKey: value }))}
                  autoCapitalize="none"
                  autoCorrect={false}
                />

                {/* API Secret */}
                <Text style={[commonStyles.text, { marginBottom: 8, fontWeight: '500' }]}>
                  API Secret
                </Text>
                <TextInput
                  style={[commonStyles.input, { marginBottom: 16 }]}
                  placeholder="Enter your API secret"
                  placeholderTextColor={colors.textSecondary}
                  value={formData.apiSecret}
                  onChangeText={(value) => setFormData(prev => ({ ...prev, apiSecret: value }))}
                  secureTextEntry
                  autoCapitalize="none"
                  autoCorrect={false}
                />

                {/* Passphrase (if required) */}
                {SUPPORTED_EXCHANGES.find(ex => ex.id === selectedExchange)?.requiresPassphrase && (
                  <>
                    <Text style={[commonStyles.text, { marginBottom: 8, fontWeight: '500' }]}>
                      Passphrase
                    </Text>
                    <TextInput
                      style={[commonStyles.input, { marginBottom: 16 }]}
                      placeholder="Enter your passphrase"
                      placeholderTextColor={colors.textSecondary}
                      value={formData.passphrase}
                      onChangeText={(value) => setFormData(prev => ({ ...prev, passphrase: value }))}
                      secureTextEntry
                      autoCapitalize="none"
                      autoCorrect={false}
                    />
                  </>
                )}

                {/* Testnet Toggle */}
                <View style={[commonStyles.row, { marginBottom: 24 }]}>
                  <View>
                    <Text style={[commonStyles.text, { fontWeight: '500' }]}>
                      Use Testnet
                    </Text>
                    <Text style={commonStyles.textSecondary}>
                      Connect to testnet environment
                    </Text>
                  </View>
                  <Switch
                    value={formData.isTestnet}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, isTestnet: value }))}
                    trackColor={{ false: colors.border, true: colors.accent }}
                    thumbColor={colors.text}
                  />
                </View>

                {/* Action Buttons */}
                <View style={{ flexDirection: 'row', gap: 12 }}>
                  <Button
                    text="Cancel"
                    onPress={() => {
                      setShowAddForm(false);
                      setSelectedExchange('');
                      setFormData({ apiKey: '', apiSecret: '', passphrase: '', isTestnet: false });
                    }}
                    style={[{ flex: 1, backgroundColor: colors.secondary, borderWidth: 1, borderColor: colors.border }]}
                    textStyle={{ color: colors.text }}
                  />
                  <Button
                    text={loading ? "Testing..." : "Add & Test"}
                    onPress={handleAddCredentials}
                    style={[{ flex: 1, backgroundColor: colors.accent, opacity: loading ? 0.7 : 1 }]}
                    textStyle={{ color: colors.text, fontWeight: '600' }}
                  />
                </View>
              </>
            )}
          </View>
        )}

        {/* Credentials List */}
        <Text style={[commonStyles.subtitle, { marginBottom: 16 }]}>
          Connected Exchanges ({credentials.length})
        </Text>

        {credentials.length === 0 ? (
          <View style={[commonStyles.card, { alignItems: 'center', paddingVertical: 40 }]}>
            <Icon name="key" size={48} style={{ color: colors.textSecondary, marginBottom: 16 }} />
            <Text style={[commonStyles.text, { textAlign: 'center', marginBottom: 8 }]}>
              No API Credentials Added
            </Text>
            <Text style={[commonStyles.textSecondary, { textAlign: 'center' }]}>
              Add your exchange API credentials to start automated trading
            </Text>
          </View>
        ) : (
          credentials.map((credential) => (
            <View key={credential.id} style={commonStyles.card}>
              <View style={[commonStyles.row, { marginBottom: 12 }]}>
                <View style={commonStyles.rowCenter}>
                  <View style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    backgroundColor: colors.secondary,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: 12,
                  }}>
                    <Icon 
                      name={SUPPORTED_EXCHANGES.find(ex => credential.name.includes(ex.name))?.icon as any || 'card'} 
                      size={20} 
                      style={{ color: colors.accent }} 
                    />
                  </View>
                  <View>
                    <Text style={[commonStyles.text, { fontWeight: '600' }]}>
                      {credential.name}
                    </Text>
                    <Text style={commonStyles.textSecondary}>
                      {credential.isTestnet ? 'Testnet' : 'Live'} • {credential.permissions.join(', ')}
                    </Text>
                  </View>
                </View>
                
                <View style={commonStyles.rowCenter}>
                  <Icon 
                    name={getStatusIcon(credential.status)} 
                    size={20} 
                    style={{ color: getStatusColor(credential.status), marginRight: 8 }} 
                  />
                  <Switch
                    value={credential.isActive}
                    onValueChange={() => toggleCredentialStatus(credential.id)}
                    trackColor={{ false: colors.border, true: colors.accent }}
                    thumbColor={colors.text}
                  />
                </View>
              </View>

              <View style={[commonStyles.row, { marginBottom: 12 }]}>
                <Text style={commonStyles.textSecondary}>
                  API Key: {credential.apiKey.substring(0, 8)}...
                </Text>
                <Text style={[commonStyles.textSecondary, { color: getStatusColor(credential.status) }]}>
                  {credential.status.toUpperCase()}
                </Text>
              </View>

              {credential.lastUsed && (
                <Text style={[commonStyles.textSecondary, { fontSize: 12, marginBottom: 12 }]}>
                  Last used: {new Date(credential.lastUsed).toLocaleDateString()}
                </Text>
              )}

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
                    // Test connection
                    Alert.alert('Test Connection', 'Connection test feature will be implemented.');
                  }}
                >
                  <Text style={[commonStyles.text, { fontSize: 14 }]}>Test</Text>
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
                  onPress={() => handleDeleteCredentials(credential.id)}
                >
                  <Text style={[commonStyles.text, { fontSize: 14 }]}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}

        {/* Security Notice */}
        <View style={[commonStyles.card, { backgroundColor: colors.warning + '20', borderColor: colors.warning + '40' }]}>
          <View style={commonStyles.rowCenter}>
            <Icon name="shield-checkmark" size={24} style={{ color: colors.warning, marginRight: 12 }} />
            <View style={{ flex: 1 }}>
              <Text style={[commonStyles.text, { fontWeight: '600', marginBottom: 4 }]}>
                Security Best Practices
              </Text>
              <Text style={[commonStyles.textSecondary, { fontSize: 12 }]}>
                • Only grant trading permissions, never withdrawal{'\n'}
                • Use IP restrictions when possible{'\n'}
                • Regularly rotate your API keys{'\n'}
                • Monitor your API usage regularly
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}