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
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { deleteWallet, getMnemonic } from '../utils/cryptoUtils';
import * as Clipboard from 'expo-clipboard';
import { useLanguage } from '../utils/LanguageContext';
import { getAvailableLanguages } from '../utils/i18n';

export default function SettingsScreen({ navigation }) {
  const { t, language, changeLanguage } = useLanguage();
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [languageModalVisible, setLanguageModalVisible] = useState(false);

  const showRecoveryPhrase = async () => {
    Alert.alert(
      t('viewSeedPhrase'),
      'Your recovery phrase is sensitive information. Make sure no one is watching your screen.',
      [
        { text: t('cancel'), style: 'cancel' },
        {
          text: 'Show',
          onPress: async () => {
            try {
              const mnemonic = await getMnemonic();
              Alert.alert(
                t('yourSeedPhrase'),
                mnemonic,
                [
                  { text: t('cancel'), style: 'cancel' },
                  {
                    text: t('copyAddress'),
                    onPress: () => Clipboard.setStringAsync(mnemonic),
                  },
                ]
              );
            } catch (error) {
              Alert.alert(t('error'), 'Failed to retrieve recovery phrase');
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
        { text: t('cancel'), style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteWallet();
              Alert.alert('Wallet Reset', 'Your wallet has been reset.', [
                {
                  text: t('ok'),
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
              Alert.alert(t('error'), 'Failed to reset wallet');
            }
          },
        },
      ]
    );
  };

  const selectLanguage = (langCode) => {
    changeLanguage(langCode);
    setLanguageModalVisible(false);
  };

  const getCurrentLanguageName = () => {
    const languages = getAvailableLanguages();
    return languages.find(lang => lang.code === language)?.nativeName || 'English';
  };

  const LanguageModal = () => {
    const languages = getAvailableLanguages();
    
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={languageModalVisible}
        onRequestClose={() => setLanguageModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{t('language')}</Text>
              <TouchableOpacity
                onPress={() => setLanguageModalVisible(false)}
                style={styles.modalCloseButton}
              >
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>
            
            {languages.map((lang) => (
              <TouchableOpacity
                key={lang.code}
                style={[
                  styles.languageOption,
                  language === lang.code && styles.selectedLanguageOption
                ]}
                onPress={() => selectLanguage(lang.code)}
              >
                <Text style={[
                  styles.languageOptionText,
                  language === lang.code && styles.selectedLanguageOptionText
                ]}>
                  {lang.nativeName}
                </Text>
                {language === lang.code && (
                  <Ionicons name="checkmark" size={20} color="#007AFF" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>
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
        <Text style={styles.headerTitle}>{t('settings')}</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <SettingSection title={t('security')}>
          <SettingItem
            icon="finger-print"
            title={t('biometricAuth')}
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
            title={t('viewSeedPhrase')}
            subtitle="View your 12-word backup phrase"
            onPress={showRecoveryPhrase}
            color="#FF9500"
          />
        </SettingSection>

        <SettingSection title={t('general')}>
          <SettingItem
            icon="language"
            title={t('language')}
            subtitle={getCurrentLanguageName()}
            onPress={() => setLanguageModalVisible(true)}
            color="#5856D6"
          />
        </SettingSection>

        <SettingSection title={t('notifications')}>
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

        <SettingSection title={t('about')}>
          <SettingItem
            icon="information-circle"
            title={t('version')}
            subtitle="1.0.0"
            onPress={() => {}}
            rightComponent={<Text style={styles.versionText}>1.0.0</Text>}
          />
          
          <SettingItem
            icon="help-circle"
            title={t('support')}
            subtitle="Get help with using the app"
            onPress={() => Alert.alert(t('support'), 'Help documentation would be available here')}
          />
          
          <SettingItem
            icon="document-text"
            title={t('termsOfService')}
            onPress={() => Alert.alert('Terms', 'Terms of service would be displayed here')}
          />
          
          <SettingItem
            icon="shield-checkmark"
            title={t('privacyPolicy')}
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
      </ScrollView>

      <LanguageModal />
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
  },
  content: {
    flex: 1,
  },
  settingSection: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    marginLeft: 20,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  sectionContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginHorizontal: 20,
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  versionText: {
    fontSize: 16,
    color: '#666',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 16,
    width: '80%',
    maxWidth: 300,
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  modalCloseButton: {
    padding: 4,
  },
  languageOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  selectedLanguageOption: {
    backgroundColor: '#F0F8FF',
  },
  languageOptionText: {
    fontSize: 16,
    color: '#333',
  },
  selectedLanguageOptionText: {
    color: '#007AFF',
    fontWeight: '500',
  },
}); 