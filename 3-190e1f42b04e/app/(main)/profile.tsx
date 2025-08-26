import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { router } from 'expo-router';
import { commonStyles, colors } from '../../styles/commonStyles';
import Icon from '../../components/Icon';
import Button from '../../components/Button';
import { DrawerActions } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../contexts/AuthContext';

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  country: string;
  timezone: string;
  memberSince: string;
  accountType: 'Basic' | 'Pro' | 'Premium';
}

export default function ProfileScreen() {
  const navigation = useNavigation();
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<UserProfile>({
    name: user ? `${user.firstName} ${user.lastName}` : 'User',
    email: user?.email || '',
    phone: '+1 (555) 123-4567',
    country: 'United States',
    timezone: 'UTC-5 (EST)',
    memberSince: user?.memberSince || new Date().toISOString().split('T')[0],
    accountType: user?.accountType || 'Basic',
  });

  const [editedProfile, setEditedProfile] = useState<UserProfile>(profile);

  useEffect(() => {
    if (user) {
      const updatedProfile = {
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        phone: '+1 (555) 123-4567',
        country: 'United States',
        timezone: 'UTC-5 (EST)',
        memberSince: user.memberSince,
        accountType: user.accountType,
      };
      setProfile(updatedProfile);
      setEditedProfile(updatedProfile);
    }
  }, [user]);

  const handleSave = async () => {
    try {
      // Update the name in the user context
      const nameParts = editedProfile.name.split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';
      
      await updateUser({
        firstName,
        lastName,
        email: editedProfile.email,
      });
      
      setProfile(editedProfile);
      setIsEditing(false);
      Alert.alert('Success', 'Profile updated successfully!');
      console.log('Profile updated:', editedProfile);
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    }
  };

  const handleCancel = () => {
    setEditedProfile(profile);
    setIsEditing(false);
  };

  const getAccountTypeColor = (type: string) => {
    switch (type) {
      case 'Basic':
        return colors.textSecondary;
      case 'Pro':
        return colors.accent;
      case 'Premium':
        return colors.warning;
      default:
        return colors.textSecondary;
    }
  };

  const renderField = (label: string, key: keyof UserProfile, editable: boolean = true) => (
    <View style={commonStyles.mb16}>
      <Text style={[commonStyles.textSecondary, commonStyles.mb8]}>{label}</Text>
      {isEditing && editable ? (
        <TextInput
          style={commonStyles.input}
          value={editedProfile[key]}
          onChangeText={(value) => setEditedProfile(prev => ({ ...prev, [key]: value }))}
          placeholder={label}
          placeholderTextColor={colors.textSecondary}
        />
      ) : (
        <Text style={[commonStyles.text, { fontSize: 16 }]}>
          {profile[key]}
        </Text>
      )}
    </View>
  );

  return (
    <View style={commonStyles.container}>
      <View style={commonStyles.header}>
        <View style={commonStyles.row}>
          <TouchableOpacity onPress={() => navigation.dispatch(DrawerActions.openDrawer())}>
            <Icon name="menu" size={24} style={{ color: colors.text }} />
          </TouchableOpacity>
          <Text style={commonStyles.headerTitle}>Profile</Text>
          <TouchableOpacity onPress={() => setIsEditing(!isEditing)}>
            <Icon name={isEditing ? "close" : "create"} size={24} style={{ color: colors.text }} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={commonStyles.content}>
        {/* Profile Header */}
        <View style={[commonStyles.card, { alignItems: 'center' }]}>
          <View style={[
            {
              width: 80,
              height: 80,
              borderRadius: 40,
              backgroundColor: colors.accent,
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 16,
            }
          ]}>
            <Text style={[commonStyles.text, { fontSize: 32, fontWeight: '700' }]}>
              {profile.name.split(' ').map(n => n[0]).join('')}
            </Text>
          </View>
          
          <Text style={[commonStyles.title, { marginBottom: 4 }]}>
            {profile.name}
          </Text>
          
          <View style={[
            {
              backgroundColor: getAccountTypeColor(profile.accountType),
              paddingHorizontal: 12,
              paddingVertical: 4,
              borderRadius: 16,
              marginBottom: 8,
            }
          ]}>
            <Text style={[commonStyles.textSecondary, { color: colors.text, fontSize: 12 }]}>
              {profile.accountType} Member
            </Text>
          </View>
          
          <Text style={commonStyles.textSecondary}>
            Member since {new Date(profile.memberSince).toLocaleDateString()}
          </Text>
        </View>

        {/* Profile Information */}
        <View style={commonStyles.card}>
          <Text style={[commonStyles.subtitle, commonStyles.mb16]}>
            Personal Information
          </Text>
          
          {renderField('Full Name', 'name')}
          {renderField('Email Address', 'email')}
          {renderField('Phone Number', 'phone')}
          {renderField('Country', 'country')}
          {renderField('Timezone', 'timezone')}
          {renderField('Account Type', 'accountType', false)}

          {isEditing && (
            <View style={[commonStyles.row, { marginTop: 16 }]}>
              <Button
                text="Cancel"
                onPress={handleCancel}
                style={[{ backgroundColor: colors.secondary, flex: 1, marginRight: 8 }]}
              />
              <Button
                text="Save"
                onPress={handleSave}
                style={[{ backgroundColor: colors.success, flex: 1, marginLeft: 8 }]}
              />
            </View>
          )}
        </View>

        {/* Account Statistics */}
        <View style={commonStyles.card}>
          <Text style={[commonStyles.subtitle, commonStyles.mb16]}>
            Account Statistics
          </Text>
          
          <View style={[commonStyles.row, commonStyles.mb8]}>
            <Text style={commonStyles.textSecondary}>Total Bots Created</Text>
            <Text style={[commonStyles.text, { fontWeight: '600' }]}>
              12
            </Text>
          </View>

          <View style={[commonStyles.row, commonStyles.mb8]}>
            <Text style={commonStyles.textSecondary}>Total Trades</Text>
            <Text style={[commonStyles.text, { fontWeight: '600' }]}>
              1,456
            </Text>
          </View>

          <View style={[commonStyles.row, commonStyles.mb8]}>
            <Text style={commonStyles.textSecondary}>Total Volume</Text>
            <Text style={[commonStyles.text, { fontWeight: '600' }]}>
              $125,430
            </Text>
          </View>

          <View style={commonStyles.row}>
            <Text style={commonStyles.textSecondary}>Win Rate</Text>
            <Text style={[commonStyles.text, { fontWeight: '600', color: colors.success }]}>
              72.3%
            </Text>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={commonStyles.card}>
          <Text style={[commonStyles.subtitle, commonStyles.mb16]}>
            Quick Actions
          </Text>
          
          <TouchableOpacity
            style={[
              {
                backgroundColor: colors.secondary,
                borderRadius: 8,
                padding: 16,
                marginBottom: 12,
                flexDirection: 'row',
                alignItems: 'center',
              }
            ]}
            onPress={() => console.log('Navigate to subscription')}
          >
            <Icon name="card" size={24} style={{ color: colors.accent, marginRight: 16 }} />
            <View style={commonStyles.flex1}>
              <Text style={[commonStyles.text, { fontWeight: '600', marginBottom: 2 }]}>
                Manage Subscription
              </Text>
              <Text style={commonStyles.textSecondary}>
                Upgrade or manage your plan
              </Text>
            </View>
            <Icon name="chevron-forward" size={20} style={{ color: colors.textSecondary }} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              {
                backgroundColor: colors.secondary,
                borderRadius: 8,
                padding: 16,
                marginBottom: 12,
                flexDirection: 'row',
                alignItems: 'center',
              }
            ]}
            onPress={() => console.log('Navigate to referrals')}
          >
            <Icon name="people" size={24} style={{ color: colors.accent, marginRight: 16 }} />
            <View style={commonStyles.flex1}>
              <Text style={[commonStyles.text, { fontWeight: '600', marginBottom: 2 }]}>
                Refer Friends
              </Text>
              <Text style={commonStyles.textSecondary}>
                Earn rewards for referrals
              </Text>
            </View>
            <Icon name="chevron-forward" size={20} style={{ color: colors.textSecondary }} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              {
                backgroundColor: colors.secondary,
                borderRadius: 8,
                padding: 16,
                flexDirection: 'row',
                alignItems: 'center',
              }
            ]}
            onPress={() => router.push('/(main)/settings')}
          >
            <Icon name="settings" size={24} style={{ color: colors.accent, marginRight: 16 }} />
            <View style={commonStyles.flex1}>
              <Text style={[commonStyles.text, { fontWeight: '600', marginBottom: 2 }]}>
                Account Settings
              </Text>
              <Text style={commonStyles.textSecondary}>
                Security and preferences
              </Text>
            </View>
            <Icon name="chevron-forward" size={20} style={{ color: colors.textSecondary }} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}