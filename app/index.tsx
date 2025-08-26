import { Text, View, Image, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { useState, useEffect } from 'react';
import Button from '../components/Button';
import Icon from '../components/Icon';
import { commonStyles, colors } from '../styles/commonStyles';
import { useAuth } from '../contexts/AuthContext';

// Declare the window properties we're using
declare global {
  interface Window {
    handleInstallClick: () => void;
    canInstall: boolean;
  }
}

export default function MainScreen() {
  const [canInstall, setCanInstall] = useState(false);
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    // Initial check
    setCanInstall(false);

    // Set up polling interval
    const intervalId = setInterval(() => {
      if(window.canInstall) {
        setCanInstall(true);
        clearInterval(intervalId);
      }
    }, 500);

    // Cleanup
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    // Redirect to dashboard if already authenticated
    if (!isLoading && isAuthenticated) {
      router.replace('/(main)/dashboard');
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

  return (
    <View style={commonStyles.container}>
      <View style={[commonStyles.content, { justifyContent: 'center', alignItems: 'center', padding: 20 }]}>
        {/* Logo/Icon */}
        <View style={[
          {
            width: 120,
            height: 120,
            borderRadius: 60,
            backgroundColor: colors.accent,
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 32,
          }
        ]}>
          <Icon name="trending-up" size={60} style={{ color: colors.text }} />
        </View>

        {/* Title */}
        <Text style={[commonStyles.title, { fontSize: 32, marginBottom: 16 }]}>
          3Commas Mobile
        </Text>
        
        <Text style={[commonStyles.textSecondary, { textAlign: 'center', marginBottom: 48, fontSize: 18 }]}>
          Advanced crypto trading automation platform
        </Text>

        {/* Features */}
        <View style={[{ width: '100%', marginBottom: 48 }]}>
          <View style={[commonStyles.rowCenter, { marginBottom: 16 }]}>
            <Icon name="robot" size={24} style={{ color: colors.accent, marginRight: 12 }} />
            <Text style={commonStyles.text}>Automated Trading Bots</Text>
          </View>
          
          <View style={[commonStyles.rowCenter, { marginBottom: 16 }]}>
            <Icon name="pie-chart" size={24} style={{ color: colors.accent, marginRight: 12 }} />
            <Text style={commonStyles.text}>Portfolio Management</Text>
          </View>
          
          <View style={[commonStyles.rowCenter, { marginBottom: 16 }]}>
            <Icon name="bar-chart" size={24} style={{ color: colors.accent, marginRight: 12 }} />
            <Text style={commonStyles.text}>Advanced Analytics</Text>
          </View>
          
          <View style={[commonStyles.rowCenter]}>
            <Icon name="shield-checkmark" size={24} style={{ color: colors.accent, marginRight: 12 }} />
            <Text style={commonStyles.text}>Secure & Reliable</Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={[{ width: '100%' }]}>
          <Button
            text="Sign In"
            onPress={() => router.push('/auth/login')}
            style={[
              {
                backgroundColor: colors.accent,
                borderRadius: 12,
                paddingVertical: 16,
                marginBottom: 16,
                width: '100%',
              }
            ]}
            textStyle={{ color: colors.text, fontWeight: '600', fontSize: 18 }}
          />

          <Button
            text="Create Account"
            onPress={() => router.push('/auth/signup')}
            style={[
              {
                backgroundColor: colors.secondary,
                borderRadius: 12,
                paddingVertical: 16,
                marginBottom: 16,
                borderWidth: 1,
                borderColor: colors.border,
                width: '100%',
              }
            ]}
            textStyle={{ color: colors.text, fontWeight: '600', fontSize: 16 }}
          />

          {canInstall && (
            <Button
              text="Install App"
              onPress={() => {
                if(window.handleInstallClick) {
                  window.handleInstallClick();
                  setCanInstall(false);
                }
              }}
              style={[
                {
                  backgroundColor: colors.input,
                  borderRadius: 12,
                  paddingVertical: 16,
                  borderWidth: 1,
                  borderColor: colors.border,
                  width: '100%',
                }
              ]}
              textStyle={{ color: colors.textSecondary, fontWeight: '600', fontSize: 14 }}
            />
          )}
        </View>
      </View>
    </View>
  );
}