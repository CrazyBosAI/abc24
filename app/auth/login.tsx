import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { router } from 'expo-router';
import { commonStyles, colors } from '../../styles/commonStyles';
import Button from '../../components/Button';
import Icon from '../../components/Icon';
import { useAuth } from '../../contexts/AuthContext';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (!email.includes('@')) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    setLoading(true);
    try {
      console.log('Attempting login with:', email);
      const success = await login(email, password);
      
      if (success) {
        console.log('Login successful, navigating to dashboard');
        router.replace('/(main)/dashboard');
      } else {
        Alert.alert('Error', 'Invalid email or password');
      }
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Error', 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    Alert.alert(
      'Forgot Password',
      'Password reset functionality will be implemented with backend integration.',
      [{ text: 'OK' }]
    );
  };

  return (
    <KeyboardAvoidingView 
      style={commonStyles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={[commonStyles.content, { justifyContent: 'center', paddingHorizontal: 24 }]}>
          {/* Header */}
          <View style={{ alignItems: 'center', marginBottom: 48 }}>
            <View style={{
              width: 80,
              height: 80,
              borderRadius: 40,
              backgroundColor: colors.accent,
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 24,
            }}>
              <Icon name="trending-up" size={40} style={{ color: colors.text }} />
            </View>
            
            <Text style={[commonStyles.title, { fontSize: 28, textAlign: 'center' }]}>
              Welcome Back
            </Text>
            <Text style={[commonStyles.textSecondary, { textAlign: 'center', fontSize: 16 }]}>
              Sign in to your 3Commas account
            </Text>
          </View>

          {/* Login Form */}
          <View style={{ marginBottom: 32 }}>
            {/* Email Input */}
            <View style={{ marginBottom: 20 }}>
              <Text style={[commonStyles.text, { marginBottom: 8, fontWeight: '500' }]}>
                Email Address
              </Text>
              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: colors.input,
                borderRadius: 12,
                borderWidth: 1,
                borderColor: colors.border,
                paddingHorizontal: 16,
              }}>
                <Icon name="mail" size={20} style={{ color: colors.textSecondary, marginRight: 12 }} />
                <TextInput
                  style={[commonStyles.input, { 
                    flex: 1, 
                    backgroundColor: 'transparent',
                    borderWidth: 0,
                    padding: 16,
                  }]}
                  placeholder="Enter your email"
                  placeholderTextColor={colors.textSecondary}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
            </View>

            {/* Password Input */}
            <View style={{ marginBottom: 24 }}>
              <Text style={[commonStyles.text, { marginBottom: 8, fontWeight: '500' }]}>
                Password
              </Text>
              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: colors.input,
                borderRadius: 12,
                borderWidth: 1,
                borderColor: colors.border,
                paddingHorizontal: 16,
              }}>
                <Icon name="lock-closed" size={20} style={{ color: colors.textSecondary, marginRight: 12 }} />
                <TextInput
                  style={[commonStyles.input, { 
                    flex: 1, 
                    backgroundColor: 'transparent',
                    borderWidth: 0,
                    padding: 16,
                  }]}
                  placeholder="Enter your password"
                  placeholderTextColor={colors.textSecondary}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  <Icon 
                    name={showPassword ? "eye-off" : "eye"} 
                    size={20} 
                    style={{ color: colors.textSecondary }} 
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Forgot Password */}
            <TouchableOpacity onPress={handleForgotPassword} style={{ alignSelf: 'flex-end', marginBottom: 32 }}>
              <Text style={[commonStyles.textSecondary, { color: colors.accent }]}>
                Forgot Password?
              </Text>
            </TouchableOpacity>

            {/* Login Button */}
            <Button
              text={loading ? "Signing In..." : "Sign In"}
              onPress={handleLogin}
              style={{
                backgroundColor: colors.accent,
                borderRadius: 12,
                paddingVertical: 16,
                opacity: loading ? 0.7 : 1,
              }}
              textStyle={{ color: colors.text, fontWeight: '600', fontSize: 16 }}
            />
          </View>

          {/* Sign Up Link */}
          <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
            <Text style={commonStyles.textSecondary}>
              Don&apos;t have an account? 
            </Text>
            <TouchableOpacity onPress={() => router.push('/auth/signup')}>
              <Text style={[commonStyles.text, { color: colors.accent, marginLeft: 4, fontWeight: '500' }]}>
                Sign Up
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}