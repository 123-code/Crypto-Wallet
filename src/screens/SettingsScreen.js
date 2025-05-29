import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  ScrollView,
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { deleteWallet, getMnemonic } from '../utils/cryptoUtils';
import * as Clipboard from 'expo-clipboard';

export default function SettingsScreen({ navigation }) {
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const showRecoveryPhrase = async () => {
    Alert.alert(
      'Show Recovery Phrase',
      'Your recovery phrase is sensitive information. Make sure no one is watching your screen.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Show',
          onPress: async () => {
            try {
              const mnemonic = await getMnemonic();
              Alert.alert(
                'Recovery Phrase',
                mnemonic,
                [
                  { text: 'Cancel', style: 'cancel' },
                  {
                    text: 'Copy',
                    onPress: () => Clipboard.setStringAsync(mnemonic),
                  },
                ]
              );
            } catch (error) {
              Alert.alert('Error', 'Failed to retrieve recovery phrase');
            }
          },
        },
      ]
    );
  };

  const resetWallet = () => {
    Alert.alert(
      'Reset Wallet',
      'This will permanently delete your wallet from this device. Make sure you have your recovery phrase saved.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteWallet();
              Alert.alert('Wallet Reset', 'Your wallet has been reset.', [
                {
                  text: 'OK',
                  onPress: () => {
                    // This would restart the app navigation
                    navigation.reset({
                      index: 0,
                      routes: [{ name: 'Welcome' }],
                    });
                  },
                },
              ]);
            } catch (error) {
              Alert.alert('Error', 'Failed to reset wallet');
            }
          },
        },
      ]
    );
  };

  const SettingItem = ({ icon, title, subtitle, onPress, rightComponent, color = '#007AFF' }) => (
    <TouchableOpacity style={styles.settingItem} onPress={onPress}>
      <View style={styles.settingLeft}>
        <View style={[styles.settingIcon, { backgroundColor: color + '20' }]}>
          <Ionicons name={icon} size={20} color={color} />
        </View>
        <View style={styles.settingContent}>
          <Text style={styles.settingTitle}>{title}</Text>
          {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
        </View>
      </View>
      <View style={styles.settingRight}>
        {rightComponent || <Ionicons name="chevron-forward" size={20} color="#999" />}
      </View>
    </TouchableOpacity>
  );

  const SettingSection = ({ title, children }) => (
    <View style={styles.settingSection}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionContent}>{children}</View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Settings</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <SettingSection title="Security">
          <SettingItem
            icon="finger-print"
            title="Biometric Authentication"
            subtitle="Use fingerprint or Face ID to unlock"
            rightComponent={
              <Switch
                value={biometricEnabled}
                onValueChange={setBiometricEnabled}
                trackColor={{ false: '#E5E5E5', true: '#34C759' }}
                thumbColor={biometricEnabled ? '#FFFFFF' : '#FFFFFF'}
              />
            }
          />
          
          <SettingItem
            icon="key"
            title="Show Recovery Phrase"
            subtitle="View your 12-word backup phrase"
            onPress={showRecoveryPhrase}
            color="#FF9500"
          />
        </SettingSection>

        <SettingSection title="Notifications">
          <SettingItem
            icon="notifications"
            title="Transaction Notifications"
            subtitle="Get notified about incoming transactions"
            rightComponent={
              <Switch
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
                trackColor={{ false: '#E5E5E5', true: '#34C759' }}
                thumbColor={notificationsEnabled ? '#FFFFFF' : '#FFFFFF'}
              />
            }
          />
        </SettingSection>

        <SettingSection title="About">
          <SettingItem
            icon="information-circle"
            title="App Version"
            subtitle="1.0.0"
            onPress={() => {}}
            rightComponent={<Text style={styles.versionText}>1.0.0</Text>}
          />
          
          <SettingItem
            icon="help-circle"
            title="Help & Support"
            subtitle="Get help with using the app"
            onPress={() => Alert.alert('Help', 'Help documentation would be available here')}
          />
          
          <SettingItem
            icon="document-text"
            title="Terms of Service"
            onPress={() => Alert.alert('Terms', 'Terms of service would be displayed here')}
          />
          
          <SettingItem
            icon="shield-checkmark"
            title="Privacy Policy"
            onPress={() => Alert.alert('Privacy', 'Privacy policy would be displayed here')}
          />
        </SettingSection>

        <SettingSection title="Advanced">
          <SettingItem
            icon="cloud-download"
            title="Export Wallet Data"
            subtitle="Export transaction history"
            onPress={() => Alert.alert('Export', 'Export functionality would be implemented here')}
            color="#34C759"
          />
          
          <SettingItem
            icon="trash"
            title="Reset Wallet"
            subtitle="Remove wallet from this device"
            onPress={resetWallet}
            color="#FF3B30"
          />
        </SettingSection>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Crypto Wallet v1.0.0{'\n'}
            Built with React Native & Expo
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  content: {
    flex: 1,
  },
  settingSection: {
    marginTop: 32,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
    marginHorizontal: 20,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  sectionContent: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    borderRadius: 12,
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  settingSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  settingRight: {
    marginLeft: 12,
  },
  versionText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 20,
  },
  footerText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    lineHeight: 20,
  },
}); 