import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  ScrollView,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { validateMnemonic, createWalletFromMnemonic } from '../utils/cryptoUtils';
import { useLanguage } from '../utils/LanguageContext';

export default function ImportWalletScreen({ navigation }) {
  const { t } = useLanguage();
  const [mnemonic, setMnemonic] = useState('');
  const [isImporting, setIsImporting] = useState(false);

  const importWallet = async () => {
    if (!mnemonic.trim()) {
      Alert.alert(t('error'), t('enterSeedPhrase'));
      return;
    }

    const cleanedMnemonic = mnemonic.trim().toLowerCase();
    
    if (!validateMnemonic(cleanedMnemonic)) {
      Alert.alert(t('error'), t('invalidSeedPhrase'));
      return;
    }

    setIsImporting(true);
    try {
      await createWalletFromMnemonic(cleanedMnemonic);
      Alert.alert(
        t('walletCreated'),
        'Your wallet has been imported successfully.',
        [
          {
            text: t('ok'),
            onPress: () => {
              // Navigate back to trigger App.js to recheck wallet existence
              navigation.popToTop();
            },
          },
        ]
      );
    } catch (error) {
      Alert.alert(t('error'), 'Failed to import wallet: ' + error.message);
    } finally {
      setIsImporting(false);
    }
  };

  const pasteFromClipboard = async () => {
    try {
      const { Clipboard } = await import('expo-clipboard');
      const clipboardContent = await Clipboard.getStringAsync();
      if (clipboardContent) {
        setMnemonic(clipboardContent);
      }
    } catch (error) {
      console.error('Error pasting from clipboard:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#007AFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('importWallet')}</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>{t('importWallet')}</Text>
        <Text style={styles.subtitle}>
          {t('enterSeedPhrase')}
        </Text>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>{t('yourSeedPhrase')}</Text>
          <TextInput
            style={styles.textInput}
            multiline
            numberOfLines={4}
            placeholder={t('seedPhrasePlaceholder')}
            value={mnemonic}
            onChangeText={setMnemonic}
            autoCapitalize="none"
            autoCorrect={false}
            textAlignVertical="top"
          />
          
          <TouchableOpacity 
            style={styles.pasteButton} 
            onPress={pasteFromClipboard}
          >
            <Ionicons name="clipboard-outline" size={16} color="#007AFF" />
            <Text style={styles.pasteButtonText}>{t('paste')}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.warningContainer}>
          <Ionicons name="shield-checkmark" size={24} color="#34C759" />
          <Text style={styles.warningText}>
            Your recovery phrase is never sent to our servers. It's stored securely on your device only.
          </Text>
        </View>

        <View style={styles.tipsContainer}>
          <Text style={styles.tipsTitle}>Tips:</Text>
          <Text style={styles.tipText}>• Make sure words are separated by spaces</Text>
          <Text style={styles.tipText}>• Check for spelling errors</Text>
          <Text style={styles.tipText}>• Recovery phrases are typically 12 or 24 words</Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.importButton, isImporting && styles.importButtonDisabled]}
          onPress={importWallet}
          disabled={isImporting}
        >
          {isImporting ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.importButtonText}>{t('importButton')}</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
  },
  inputContainer: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#333',
    minHeight: 120,
    backgroundColor: '#F8F9FA',
  },
  pasteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
    marginTop: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#F0F8FF',
    borderRadius: 6,
  },
  pasteButtonText: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 4,
  },
  warningContainer: {
    flexDirection: 'row',
    backgroundColor: '#F0FFF4',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    alignItems: 'flex-start',
  },
  warningText: {
    flex: 1,
    fontSize: 14,
    color: '#006400',
    marginLeft: 12,
    lineHeight: 20,
  },
  tipsContainer: {
    backgroundColor: '#F8F9FA',
    padding: 16,
    borderRadius: 12,
    marginBottom: 32,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  tipText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 4,
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  importButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  importButtonDisabled: {
    backgroundColor: '#CCE7FF',
  },
  importButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
}); 