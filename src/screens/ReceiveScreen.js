import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import QRCode from 'react-native-qrcode-svg';
import * as Clipboard from 'expo-clipboard';
import { getWalletAddresses } from '../utils/cryptoUtils';
import { useLanguage } from '../utils/LanguageContext';

export default function ReceiveScreen({ navigation }) {
  const { t } = useLanguage();
  const [selectedCrypto, setSelectedCrypto] = useState('BTC');
  const [addresses, setAddresses] = useState({ bitcoin: '', ethereum: '' });

  const cryptoOptions = [
    { symbol: 'BTC', name: 'Bitcoin', color: '#F7931A', icon: 'logo-bitcoin' },
    { symbol: 'ETH', name: 'Ethereum', color: '#627EEA', icon: 'diamond' },
  ];

  useEffect(() => {
    loadAddresses();
  }, []);

  const loadAddresses = async () => {
    try {
      const walletAddresses = await getWalletAddresses();
      setAddresses(walletAddresses);
    } catch (error) {
      console.error('Error loading addresses:', error);
      Alert.alert(t('error'), 'Failed to load wallet addresses');
    }
  };

  const getCurrentAddress = () => {
    return selectedCrypto === 'BTC' ? addresses.bitcoin : addresses.ethereum;
  };

  const copyToClipboard = async () => {
    const address = getCurrentAddress();
    if (address) {
      await Clipboard.setStringAsync(address);
      Alert.alert('Copied!', t('addressCopied'));
    }
  };

  const shareAddress = () => {
    const address = getCurrentAddress();
    Alert.alert(t('shareAddress'), `${selectedCrypto} ${t('address')}\n\n${address}`);
  };

  const CryptoSelector = () => (
    <View style={styles.cryptoSelector}>
      <Text style={styles.sectionTitle}>{t('selectCurrency')}</Text>
      <View style={styles.cryptoOptions}>
        {cryptoOptions.map((crypto) => (
          <TouchableOpacity
            key={crypto.symbol}
            style={[
              styles.cryptoOption,
              selectedCrypto === crypto.symbol && styles.cryptoOptionSelected,
            ]}
            onPress={() => setSelectedCrypto(crypto.symbol)}
          >
            <View style={[styles.cryptoOptionIcon, { backgroundColor: crypto.color + '20' }]}>
              <Ionicons name={crypto.icon} size={24} color={crypto.color} />
            </View>
            <View style={styles.cryptoOptionInfo}>
              <Text style={styles.cryptoOptionName}>{crypto.name}</Text>
              <Text style={styles.cryptoOptionSymbol}>{crypto.symbol}</Text>
            </View>
            {selectedCrypto === crypto.symbol && (
              <Ionicons name="checkmark-circle" size={24} color="#007AFF" />
            )}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t('receive')}</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <CryptoSelector />

        <View style={styles.qrSection}>
          <Text style={styles.sectionTitle}>{t('yourAddress')} {selectedCrypto}</Text>
          
          <View style={styles.qrContainer}>
            {getCurrentAddress() ? (
              <QRCode
                value={getCurrentAddress()}
                size={200}
                color="#333"
                backgroundColor="white"
              />
            ) : (
              <View style={styles.qrPlaceholder}>
                <Ionicons name="qr-code" size={80} color="#CCC" />
                <Text style={styles.qrPlaceholderText}>{t('loading')}</Text>
              </View>
            )}
          </View>

          <View style={styles.addressContainer}>
            <Text style={styles.addressLabel}>{t('address')}</Text>
            <Text style={styles.addressText}>{getCurrentAddress()}</Text>
          </View>

          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.actionButton} onPress={copyToClipboard}>
              <Ionicons name="copy-outline" size={20} color="#007AFF" />
              <Text style={styles.actionButtonText}>{t('copyAddress')}</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionButton} onPress={shareAddress}>
              <Ionicons name="share-outline" size={20} color="#007AFF" />
              <Text style={styles.actionButtonText}>{t('shareAddress')}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.infoSection}>
          <View style={styles.infoCard}>
            <Ionicons name="information-circle" size={24} color="#007AFF" />
            <View style={styles.infoContent}>
              <Text style={styles.infoTitle}>How to receive {selectedCrypto}</Text>
              <Text style={styles.infoText}>
                Share this address with the sender, or show them the QR code to scan. 
                Only send {selectedCrypto} to this address.
              </Text>
            </View>
          </View>

          <View style={styles.warningCard}>
            <Ionicons name="warning" size={24} color="#FF9500" />
            <View style={styles.infoContent}>
              <Text style={styles.warningTitle}>Important</Text>
              <Text style={styles.warningText}>
                Only send {selectedCrypto} to this address. Sending other cryptocurrencies 
                to this address may result in permanent loss of funds.
              </Text>
            </View>
          </View>
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
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  cryptoSelector: {
    marginTop: 20,
    marginBottom: 32,
  },
  cryptoOptions: {
    gap: 12,
  },
  cryptoOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  cryptoOptionSelected: {
    borderColor: '#007AFF',
    backgroundColor: '#F0F8FF',
  },
  cryptoOptionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  cryptoOptionInfo: {
    flex: 1,
  },
  cryptoOptionName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  cryptoOptionSymbol: {
    fontSize: 14,
    color: '#666',
  },
  qrSection: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  qrContainer: {
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  qrPlaceholder: {
    width: 200,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
  },
  qrPlaceholderText: {
    fontSize: 16,
    color: '#999',
    marginTop: 8,
  },
  addressContainer: {
    width: '100%',
    marginBottom: 24,
  },
  addressLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    textAlign: 'center',
  },
  addressText: {
    fontSize: 14,
    color: '#333',
    fontFamily: 'monospace',
    textAlign: 'center',
    backgroundColor: '#F8F9FA',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F8FF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  actionButtonText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
  infoSection: {
    gap: 16,
    marginBottom: 32,
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: '#F0F8FF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'flex-start',
  },
  warningCard: {
    flexDirection: 'row',
    backgroundColor: '#FFF9E6',
    padding: 16,
    borderRadius: 12,
    alignItems: 'flex-start',
  },
  infoContent: {
    flex: 1,
    marginLeft: 12,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
    marginBottom: 4,
  },
  infoText: {
    fontSize: 14,
    color: '#0066CC',
    lineHeight: 20,
  },
  warningTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#B8860B',
    marginBottom: 4,
  },
  warningText: {
    fontSize: 14,
    color: '#B8860B',
    lineHeight: 20,
  },
}); 