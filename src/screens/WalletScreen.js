import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  RefreshControl,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import {
  getWalletAddresses,
  getBitcoinBalance,
  getEthereumBalance,
} from '../utils/cryptoUtils';

export default function WalletScreen({ navigation }) {
  const [addresses, setAddresses] = useState({ bitcoin: '', ethereum: '' });
  const [balances, setBalances] = useState({ bitcoin: '0', ethereum: '0' });
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadWalletData = async () => {
    try {
      const walletAddresses = await getWalletAddresses();
      setAddresses(walletAddresses);

      // Load balances
      const [btcBalance, ethBalance] = await Promise.all([
        getBitcoinBalance(walletAddresses.bitcoin),
        getEthereumBalance(walletAddresses.ethereum),
      ]);

      setBalances({
        bitcoin: btcBalance,
        ethereum: ethBalance,
      });
    } catch (error) {
      console.error('Error loading wallet data:', error);
      Alert.alert('Error', 'Failed to load wallet data');
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadWalletData();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    loadWalletData();
  };

  const formatAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const CryptoCard = ({ name, symbol, balance, address, icon, color }) => (
    <View style={[styles.cryptoCard, { borderLeftColor: color }]}>
      <View style={styles.cryptoHeader}>
        <View style={styles.cryptoInfo}>
          <View style={[styles.cryptoIcon, { backgroundColor: color + '20' }]}>
            <Ionicons name={icon} size={24} color={color} />
          </View>
          <View>
            <Text style={styles.cryptoName}>{name}</Text>
            <Text style={styles.cryptoSymbol}>{symbol}</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.moreButton}>
          <Ionicons name="ellipsis-horizontal" size={20} color="#666" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.balanceSection}>
        <Text style={styles.balanceAmount}>{balance} {symbol}</Text>
        <Text style={styles.balanceUSD}>≈ $0.00 USD</Text>
      </View>
      
      <View style={styles.addressSection}>
        <Text style={styles.addressLabel}>Address:</Text>
        <TouchableOpacity style={styles.addressContainer}>
          <Text style={styles.addressText}>{formatAddress(address)}</Text>
          <Ionicons name="copy-outline" size={16} color="#007AFF" />
        </TouchableOpacity>
      </View>
    </View>
  );

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text>Loading wallet...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Wallet</Text>
        <TouchableOpacity style={styles.settingsButton}>
          <Ionicons name="settings-outline" size={24} color="#666" />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.totalBalanceCard}>
          <Text style={styles.totalBalanceLabel}>Total Balance</Text>
          <Text style={styles.totalBalanceAmount}>$0.00</Text>
          <Text style={styles.totalBalanceSubtext}>USD</Text>
        </View>

        <View style={styles.quickActions}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => navigation.navigate('Send')}
          >
            <View style={[styles.actionIcon, { backgroundColor: '#FF6B6B20' }]}>
              <Ionicons name="arrow-up" size={24} color="#FF6B6B" />
            </View>
            <Text style={styles.actionText}>Send</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => navigation.navigate('Receive')}
          >
            <View style={[styles.actionIcon, { backgroundColor: '#4ECDC420' }]}>
              <Ionicons name="arrow-down" size={24} color="#4ECDC4" />
            </View>
            <Text style={styles.actionText}>Receive</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton}>
            <View style={[styles.actionIcon, { backgroundColor: '#45B7D120' }]}>
              <Ionicons name="swap-horizontal" size={24} color="#45B7D1" />
            </View>
            <Text style={styles.actionText}>Swap</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton}>
            <View style={[styles.actionIcon, { backgroundColor: '#96CEB420' }]}>
              <Ionicons name="card" size={24} color="#96CEB4" />
            </View>
            <Text style={styles.actionText}>Buy</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.assetsSection}>
          <Text style={styles.sectionTitle}>Assets</Text>
          
          <CryptoCard
            name="Bitcoin"
            symbol="BTC"
            balance={balances.bitcoin}
            address={addresses.bitcoin}
            icon="logo-bitcoin"
            color="#F7931A"
          />
          
          <CryptoCard
            name="Ethereum"
            symbol="ETH"
            balance={balances.ethereum}
            address={addresses.ethereum}
            icon="diamond"
            color="#627EEA"
          />
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: 'white',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  settingsButton: {
    padding: 8,
  },
  content: {
    flex: 1,
  },
  totalBalanceCard: {
    backgroundColor: 'white',
    margin: 20,
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  totalBalanceLabel: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  totalBalanceAmount: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#333',
  },
  totalBalanceSubtext: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  actionButton: {
    alignItems: 'center',
  },
  actionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  assetsSection: {
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  cryptoCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cryptoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cryptoInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cryptoIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  cryptoName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  cryptoSymbol: {
    fontSize: 14,
    color: '#666',
  },
  moreButton: {
    padding: 4,
  },
  balanceSection: {
    marginBottom: 16,
  },
  balanceAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  balanceUSD: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  addressSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  addressLabel: {
    fontSize: 14,
    color: '#666',
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  addressText: {
    fontSize: 14,
    color: '#333',
    marginRight: 8,
    fontFamily: 'monospace',
  },
}); 