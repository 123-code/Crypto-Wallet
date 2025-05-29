import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import { generateMnemonic, createWalletFromMnemonic } from '../utils/cryptoUtils';
import { useLanguage } from '../utils/LanguageContext';

export default function CreateWalletScreen({ navigation }) {
  const { t } = useLanguage();
  const [mnemonic, setMnemonic] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [step, setStep] = useState(1); // 1: Generate, 2: Show mnemonic, 3: Confirm

  useEffect(() => {
    generateNewMnemonic();
  }, []);

  const generateNewMnemonic = () => {
    const newMnemonic = generateMnemonic();
    setMnemonic(newMnemonic);
  };

  const copyToClipboard = async () => {
    await Clipboard.setStringAsync(mnemonic);
    Alert.alert('Copied!', 'Mnemonic phrase copied to clipboard');
  };

  const createWallet = async () => {
    setIsCreating(true);
    try {
      await createWalletFromMnemonic(mnemonic);
      Alert.alert(
        t('walletCreated'),
        'Your wallet has been created successfully.',
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
      Alert.alert(t('error'), 'Failed to create wallet: ' + error.message);
    } finally {
      setIsCreating(false);
    }
  };

  const renderMnemonicWords = () => {
    const words = mnemonic.split(' ');
    return (
      <View style={styles.mnemonicContainer}>
        {words.map((word, index) => (
          <View key={index} style={styles.wordContainer}>
            <Text style={styles.wordNumber}>{index + 1}</Text>
            <Text style={styles.word}>{word}</Text>
          </View>
        ))}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#007AFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('createWallet')}</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.stepIndicator}>
          <Text style={styles.stepText}>Step 1 of 1</Text>
        </View>

        <Text style={styles.title}>{t('yourSeedPhrase')}</Text>
        <Text style={styles.subtitle}>
          {t('writeDownSeedPhrase')}
        </Text>

        {renderMnemonicWords()}

        <View style={styles.warningContainer}>
          <Ionicons name="warning" size={24} color="#FF9500" />
          <Text style={styles.warningText}>
            Never share your recovery phrase with anyone. Anyone who has access to this phrase can control your funds.
          </Text>
        </View>

        <TouchableOpacity style={styles.copyButton} onPress={copyToClipboard}>
          <Ionicons name="copy-outline" size={20} color="#007AFF" />
          <Text style={styles.copyButtonText}>{t('copyAddress')}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.regenerateButton} onPress={generateNewMnemonic}>
          <Ionicons name="refresh-outline" size={20} color="#666" />
          <Text style={styles.regenerateButtonText}>{t('generateSeedPhrase')}</Text>
        </TouchableOpacity>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.createButton, isCreating && styles.createButtonDisabled]}
          onPress={createWallet}
          disabled={isCreating}
        >
          {isCreating ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.createButtonText}>{t('createWallet')}</Text>
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
  },
  stepIndicator: {
    alignItems: 'center',
    marginVertical: 20,
  },
  stepText: {
    fontSize: 14,
    color: '#666',
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
  mnemonicContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  wordContainer: {
    width: '30%',
    backgroundColor: '#F8F9FA',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    alignItems: 'center',
  },
  wordNumber: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  word: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  warningContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFF9E6',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    alignItems: 'flex-start',
  },
  warningText: {
    flex: 1,
    fontSize: 14,
    color: '#B8860B',
    marginLeft: 12,
    lineHeight: 20,
  },
  copyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F0F8FF',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 12,
  },
  copyButtonText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
  regenerateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 32,
  },
  regenerateButtonText: {
    color: '#666',
    fontSize: 16,
    marginLeft: 8,
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  createButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  createButtonDisabled: {
    backgroundColor: '#CCE7FF',
  },
  createButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
}); 