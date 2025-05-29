import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Alert,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { sendBitcoinTransaction, sendEthereumTransaction } from '../utils/cryptoUtils';

export default function SendScreen({ navigation }) {
  const [selectedCrypto, setSelectedCrypto] = useState('BTC');
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [isSending, setIsSending] = useState(false);

  const cryptoOptions = [
    { symbol: 'BTC', name: 'Bitcoin', color: '#F7931A', icon: 'logo-bitcoin' },
    { symbol: 'ETH', name: 'Ethereum', color: '#627EEA', icon: 'diamond' },
  ];

  const sendTransaction = async () => {
    if (!recipient.trim()) {
      Alert.alert('Error', 'Please enter a recipient address');
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    setIsSending(true);
    try {
      let txHash;
      if (selectedCrypto === 'BTC') {
        txHash = await sendBitcoinTransaction(recipient, amount);
      } else {
        txHash = await sendEthereumTransaction(recipient, amount);
      }

      Alert.alert(
        'Transaction Sent!',
        `Your ${selectedCrypto} transaction has been sent.\n\nTransaction Hash: ${txHash}`,
        [
          {
            text: 'OK',
            onPress: () => {
              setRecipient('');
              setAmount('');
              navigation.navigate('Wallet');
            },
          },
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to send transaction: ' + error.message);
    } finally {
      setIsSending(false);
    }
  };

  const openQRScanner = () => {
    // This would open a QR code scanner
    Alert.alert('QR Scanner', 'QR scanner would open here');
  };

  const pasteFromClipboard = async () => {
    try {
      const { Clipboard } = await import('expo-clipboard');
      const clipboardContent = await Clipboard.getStringAsync();
      if (clipboardContent) {
        setRecipient(clipboardContent);
      }
    } catch (error) {
      console.error('Error pasting from clipboard:', error);
    }
  };

  const CryptoSelector = () => (
    <View style={styles.cryptoSelector}>
      <Text style={styles.sectionTitle}>Select Cryptocurrency</Text>
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
        <Text style={styles.headerTitle}>Send</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <CryptoSelector />

        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Recipient Address</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textInput}
              placeholder={`Enter ${selectedCrypto} address`}
              value={recipient}
              onChangeText={setRecipient}
              autoCapitalize="none"
              autoCorrect={false}
              multiline
            />
            <View style={styles.inputActions}>
              <TouchableOpacity style={styles.inputAction} onPress={pasteFromClipboard}>
                <Ionicons name="clipboard-outline" size={16} color="#007AFF" />
                <Text style={styles.inputActionText}>Paste</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.inputAction} onPress={openQRScanner}>
                <Ionicons name="qr-code-outline" size={16} color="#007AFF" />
                <Text style={styles.inputActionText}>Scan</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Amount</Text>
          <View style={styles.amountContainer}>
            <TextInput
              style={styles.amountInput}
              placeholder="0.00"
              value={amount}
              onChangeText={setAmount}
              keyboardType="decimal-pad"
              autoCapitalize="none"
              autoCorrect={false}
            />
            <Text style={styles.amountCurrency}>{selectedCrypto}</Text>
          </View>
          <Text style={styles.amountUSD}>≈ $0.00 USD</Text>
        </View>

        <View style={styles.feeSection}>
          <View style={styles.feeRow}>
            <Text style={styles.feeLabel}>Network Fee</Text>
            <Text style={styles.feeValue}>~0.001 {selectedCrypto}</Text>
          </View>
          <View style={styles.feeRow}>
            <Text style={styles.feeLabel}>Total</Text>
            <Text style={styles.feeValueTotal}>
              {amount ? (parseFloat(amount) + 0.001).toFixed(6) : '0.001'} {selectedCrypto}
            </Text>
          </View>
        </View>

        <View style={styles.warningContainer}>
          <Ionicons name="warning" size={20} color="#FF9500" />
          <Text style={styles.warningText}>
            Double-check the recipient address. Cryptocurrency transactions cannot be reversed.
          </Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.sendButton, isSending && styles.sendButtonDisabled]}
          onPress={sendTransaction}
          disabled={isSending || !recipient || !amount}
        >
          {isSending ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.sendButtonText}>Send {selectedCrypto}</Text>
          )}
        </TouchableOpacity>
      </View>
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
  formSection: {
    marginBottom: 32,
  },
  inputContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
  },
  textInput: {
    fontSize: 16,
    color: '#333',
    minHeight: 80,
    textAlignVertical: 'top',
  },
  inputActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 12,
    gap: 16,
  },
  inputAction: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F8FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  inputActionText: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 4,
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
  },
  amountInput: {
    flex: 1,
    fontSize: 24,
    fontWeight: '600',
    color: '#333',
  },
  amountCurrency: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
  },
  amountUSD: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  feeSection: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  feeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  feeLabel: {
    fontSize: 16,
    color: '#666',
  },
  feeValue: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  feeValueTotal: {
    fontSize: 16,
    color: '#333',
    fontWeight: 'bold',
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
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  sendButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#CCE7FF',
  },
  sendButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
}); 