import * as bip39 from 'bip39';
import { ethers } from 'ethers';
import * as SecureStore from 'expo-secure-store';

// Storage keys
const STORAGE_KEYS = {
  MNEMONIC: 'wallet_mnemonic',
  BTC_ADDRESS: 'btc_address',
  ETH_ADDRESS: 'eth_address',
  BTC_PRIVATE_KEY: 'btc_private_key',
  ETH_PRIVATE_KEY: 'eth_private_key',
};

// Generate a new mnemonic phrase
export const generateMnemonic = () => {
  return bip39.generateMnemonic();
};

// Validate mnemonic phrase
export const validateMnemonic = (mnemonic) => {
  return bip39.validateMnemonic(mnemonic);
};

// Simple Bitcoin address generation using ethers (for demo purposes)
// In a production app, you'd use proper Bitcoin libraries or a backend service
const generateBitcoinAddressFromEthereumWallet = (ethWallet) => {
  // This is a simplified approach - generating a mock Bitcoin address
  // In reality, you'd need proper Bitcoin key derivation
  const hash = ethWallet.address.slice(2, 36); // Take part of ETH address
  return `1${hash}BitcoinAddr`; // Mock Bitcoin address format
};

// Create wallet from mnemonic
export const createWalletFromMnemonic = async (mnemonic) => {
  try {
    if (!validateMnemonic(mnemonic)) {
      throw new Error('Invalid mnemonic phrase');
    }

    // Create Ethereum wallet
    const ethWallet = ethers.Wallet.fromPhrase(mnemonic);
    const ethAddress = ethWallet.address;
    const ethPrivateKey = ethWallet.privateKey;

    // Generate a mock Bitcoin address (in production, use proper Bitcoin libraries or backend)
    const btcAddress = generateBitcoinAddressFromEthereumWallet(ethWallet);
    const btcPrivateKey = ethWallet.privateKey; // Using same key for demo (not recommended in production)

    // Store securely
    await SecureStore.setItemAsync(STORAGE_KEYS.MNEMONIC, mnemonic);
    await SecureStore.setItemAsync(STORAGE_KEYS.BTC_ADDRESS, btcAddress);
    await SecureStore.setItemAsync(STORAGE_KEYS.ETH_ADDRESS, ethAddress);
    await SecureStore.setItemAsync(STORAGE_KEYS.BTC_PRIVATE_KEY, btcPrivateKey);
    await SecureStore.setItemAsync(STORAGE_KEYS.ETH_PRIVATE_KEY, ethPrivateKey);

    return {
      mnemonic,
      addresses: {
        bitcoin: btcAddress,
        ethereum: ethAddress,
      },
    };
  } catch (error) {
    console.error('Error creating wallet:', error);
    throw error;
  }
};

// Get wallet addresses
export const getWalletAddresses = async () => {
  try {
    const btcAddress = await SecureStore.getItemAsync(STORAGE_KEYS.BTC_ADDRESS);
    const ethAddress = await SecureStore.getItemAsync(STORAGE_KEYS.ETH_ADDRESS);
    
    return {
      bitcoin: btcAddress,
      ethereum: ethAddress,
    };
  } catch (error) {
    console.error('Error getting wallet addresses:', error);
    throw error;
  }
};

// Get mnemonic phrase
export const getMnemonic = async () => {
  try {
    return await SecureStore.getItemAsync(STORAGE_KEYS.MNEMONIC);
  } catch (error) {
    console.error('Error getting mnemonic:', error);
    throw error;
  }
};

// Bitcoin balance (mock implementation - you'd need to connect to a Bitcoin API)
export const getBitcoinBalance = async (address) => {
  try {
    // This is a mock implementation
    // In a real app, you'd call a Bitcoin API like BlockCypher, Blockstream, etc.
    console.log('Getting Bitcoin balance for:', address);
    return '0.00124567'; // Mock balance
  } catch (error) {
    console.error('Error getting Bitcoin balance:', error);
    throw error;
  }
};

// Ethereum balance
export const getEthereumBalance = async (address) => {
  try {
    // Using Infura as provider (you'd need to add your own API key)
    // For demo purposes, returning mock data
    console.log('Getting Ethereum balance for:', address);
    return '0.0234'; // Mock balance
  } catch (error) {
    console.error('Error getting Ethereum balance:', error);
    throw error;
  }
};

// Send Bitcoin transaction (mock implementation)
export const sendBitcoinTransaction = async (toAddress, amount) => {
  try {
    console.log(`Sending ${amount} BTC to ${toAddress}`);
    // This would implement actual Bitcoin transaction logic
    // You'd need to:
    // 1. Get UTXOs for the address
    // 2. Create transaction
    // 3. Sign with private key
    // 4. Broadcast to network
    
    // Mock transaction hash
    return '2a1b2c3d4e5f6789abcdef0123456789abcdef0123456789abcdef0123456789';
  } catch (error) {
    console.error('Error sending Bitcoin transaction:', error);
    throw error;
  }
};

// Send Ethereum transaction (mock implementation)
export const sendEthereumTransaction = async (toAddress, amount) => {
  try {
    console.log(`Sending ${amount} ETH to ${toAddress}`);
    // This would implement actual Ethereum transaction logic
    // You'd need to:
    // 1. Connect to Ethereum provider
    // 2. Create transaction object
    // 3. Sign with private key
    // 4. Send transaction
    
    // Mock transaction hash
    return '0x1a2b3c4d5e6f7890abcdef0123456789abcdef0123456789abcdef0123456789';
  } catch (error) {
    console.error('Error sending Ethereum transaction:', error);
    throw error;
  }
};

// Delete wallet (for testing/reset purposes)
export const deleteWallet = async () => {
  try {
    await SecureStore.deleteItemAsync(STORAGE_KEYS.MNEMONIC);
    await SecureStore.deleteItemAsync(STORAGE_KEYS.BTC_ADDRESS);
    await SecureStore.deleteItemAsync(STORAGE_KEYS.ETH_ADDRESS);
    await SecureStore.deleteItemAsync(STORAGE_KEYS.BTC_PRIVATE_KEY);
    await SecureStore.deleteItemAsync(STORAGE_KEYS.ETH_PRIVATE_KEY);
  } catch (error) {
    console.error('Error deleting wallet:', error);
    throw error;
  }
}; 