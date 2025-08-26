import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { router } from 'expo-router';
import { commonStyles, colors } from '../../styles/commonStyles';
import Button from '../../components/Button';
import Icon from '../../components/Icon';
import { useAuth } from '../../contexts/AuthContext';

export default function SignUpScreen() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const { signup } = useAuth();

  const updateFormData = (key: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const validateForm = () => {
    const { firstName, lastName, email, password, confirmPassword } = formData;

    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return false;
    }

    if (!email.includes('@')) {
      Alert.alert('Error', 'Please enter a valid email address');
      return false;
    }

    if (password.length < 8) {
      Alert.alert('Error', 'Password must be at least 8 characters long');
      return false;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return false;
    }

    if (!acceptedTerms) {
      Alert.alert('Error', 'Please accept the terms and conditions');
      return false;
    }

    return true;
  };

  const handleSignUp = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      console.log('Attempting signup with:', formData.email);
      const success = await signup(formData.email, formData.password, {
        firstName: formData.firstName,
        lastName: formData.lastName,
      });
      
      if (success) {
        console.log('Signup successful, navigating to dashboard');
        Alert.alert(
          'Success',
          'Account created successfully! Welcome to 3Commas.',
          [{ text: 'OK', onPress: () => router.replace('/(main)/dashboard') }]
        );
      } else {
        Alert.alert('Error', 'Failed to create account. Please try again.');
      }
    } catch (error) {
      console.error('Signup error:', error);
      Alert.alert('Error', 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={commonStyles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={[commonStyles.content, { paddingHorizontal: 24, paddingTop: 40 }]}>
          {/* Header */}
          <View style={{ alignItems: 'center', marginBottom: 40 }}>
            <View style={{
              width: 80,
              height: 80,
              borderRadius: 40,
              backgroundColor: colors.accent,
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 24,
            }}>
              <Icon name="person-add" size={40} style={{ color: colors.text }} />
            </View>
            
            <Text style={[commonStyles.title, { fontSize: 28, textAlign: 'center' }]}>
              Create Account
            </Text>
            <Text style={[commonStyles.textSecondary, { textAlign: 'center', fontSize: 16 }]}>
              Join 3Commas and start trading
            </Text>
          </View>

          {/* Sign Up Form */}
          <View style={{ marginBottom: 32 }}>
            {/* Name Fields */}
            <View style={{ flexDirection: 'row', marginBottom: 20, gap: 12 }}>
              <View style={{ flex: 1 }}>
                <Text style={[commonStyles.text, { marginBottom: 8, fontWeight: '500' }]}>
                  First Name
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
                  <Icon name="person" size={20} style={{ color: colors.textSecondary, marginRight: 12 }} />
                  <TextInput
                    style={[commonStyles.input, { 
                      flex: 1, 
                      backgroundColor: 'transparent',
                      borderWidth: 0,
                      padding: 16,
                    }]}
                    placeholder="First name"
                    placeholderTextColor={colors.textSecondary}
                    value={formData.firstName}
                    onChangeText={(value) => updateFormData('firstName', value)}
                    autoCapitalize="words"
                  />
                </View>
              </View>

              <View style={{ flex: 1 }}>
                <Text style={[commonStyles.text, { marginBottom: 8, fontWeight: '500' }]}>
                  Last Name
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
                  <TextInput
                    style={[commonStyles.input, { 
                      flex: 1, 
                      backgroundColor: 'transparent',
                      borderWidth: 0,
                      padding: 16,
                    }]}
                    placeholder="Last name"
                    placeholderTextColor={colors.textSecondary}
                    value={formData.lastName}
                    onChangeText={(value) => updateFormData('lastName', value)}
                    autoCapitalize="words"
                  />
                </View>
              </View>
            </View>

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
                  value={formData.email}
                  onChangeText={(value) => updateFormData('email', value)}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
            </View>

            {/* Password Input */}
            <View style={{ marginBottom: 20 }}>
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
                  placeholder="Create a password"
                  placeholderTextColor={colors.textSecondary}
                  value={formData.password}
                  onChangeText={(value) => updateFormData('password', value)}
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

            {/* Confirm Password Input */}
            <View style={{ marginBottom: 24 }}>
              <Text style={[commonStyles.text, { marginBottom: 8, fontWeight: '500' }]}>
                Confirm Password
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
                  placeholder="Confirm your password"
                  placeholderTextColor={colors.textSecondary}
                  value={formData.confirmPassword}
                  onChangeText={(value) => updateFormData('confirmPassword', value)}
                  secureTextEntry={!showConfirmPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                  <Icon 
                    name={showConfirmPassword ? "eye-off" : "eye"} 
                    size={20} 
                    style={{ color: colors.textSecondary }} 
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Terms and Conditions */}
            <TouchableOpacity 
              style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 32 }}
              onPress={() => setAcceptedTerms(!acceptedTerms)}
            >
              <View style={{
                width: 20,
                height: 20,
                borderRadius: 4,
                borderWidth: 2,
                borderColor: acceptedTerms ? colors.accent : colors.border,
                backgroundColor: acceptedTerms ? colors.accent : 'transparent',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 12,
              }}>
                {acceptedTerms && (
                  <Icon name="checkmark" size={12} style={{ color: colors.text }} />
                )}
              </View>
              <Text style={[commonStyles.textSecondary, { flex: 1 }]}>
                I agree to the{' '}
                <Text style={{ color: colors.accent }}>Terms of Service</Text>
                {' '}and{' '}
                <Text style={{ color: colors.accent }}>Privacy Policy</Text>
              </Text>
            </TouchableOpacity>

            {/* Sign Up Button */}
            <Button
              text={loading ? "Creating Account..." : "Create Account"}
              onPress={handleSignUp}
              style={{
                backgroundColor: colors.accent,
                borderRadius: 12,
                paddingVertical: 16,
                opacity: loading ? 0.7 : 1,
              }}
              textStyle={{ color: colors.text, fontWeight: '600', fontSize: 16 }}
            />
          </View>

          {/* Sign In Link */}
          <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingBottom: 20 }}>
            <Text style={commonStyles.textSecondary}>
              Already have an account? 
            </Text>
            <TouchableOpacity onPress={() => router.push('/auth/login')}>
              <Text style={[commonStyles.text, { color: colors.accent, marginLeft: 4, fontWeight: '500' }]}>
                Sign In
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}