# Crypto Wallet - React Native App

A secure React Native cryptocurrency wallet supporting Bitcoin and Ethereum, built with Expo.

## Features

- 🔐 **Secure Wallet Creation**: Generate new wallets with 12-word mnemonic phrases
- 📱 **Import Existing Wallets**: Import wallets using recovery phrases
- 💰 **Multi-Currency Support**: Bitcoin (BTC) and Ethereum (ETH)
- 📊 **Balance Tracking**: View real-time balances for all supported currencies
- 💸 **Send Transactions**: Send Bitcoin and Ethereum to any address
- 📨 **Receive Funds**: Generate QR codes and share addresses
- 🔒 **Secure Storage**: Private keys stored securely on device using Expo SecureStore
- 🎨 **Modern UI**: Clean, intuitive interface with Material Design principles

## Screenshots

*Screenshots would be added here in a real project*

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator (for iOS development) or Android Emulator (for Android development)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd crypto-wallet
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Start the development server:
```bash
npm start
# or
yarn start
```

4. Run on your preferred platform:
- **iOS**: Press `i` in the terminal or scan QR code with Camera app
- **Android**: Press `a` in the terminal or scan QR code with Expo Go app
- **Web**: Press `w` in the terminal

## Project Structure

```
crypto-wallet/
├── App.js                 # Main app component with navigation
├── src/
│   ├── screens/           # App screens
│   │   ├── WelcomeScreen.js
│   │   ├── CreateWalletScreen.js
│   │   ├── ImportWalletScreen.js
│   │   ├── WalletScreen.js
│   │   ├── SendScreen.js
│   │   ├── ReceiveScreen.js
│   │   └── SettingsScreen.js
│   └── utils/
│       └── cryptoUtils.js # Cryptocurrency utilities
├── package.json
├── app.json              # Expo configuration
└── README.md
```

## Key Dependencies

- **React Native**: Cross-platform mobile development
- **Expo**: Development platform and tools
- **React Navigation**: Navigation library
- **bitcoinjs-lib**: Bitcoin operations
- **ethers**: Ethereum operations
- **bip39**: Mnemonic phrase generation and validation
- **expo-secure-store**: Secure local storage
- **react-native-qrcode-svg**: QR code generation

## Security Features

- **Mnemonic Generation**: Cryptographically secure 12-word recovery phrases
- **Secure Storage**: Private keys encrypted and stored locally using Expo SecureStore
- **No Server Storage**: All sensitive data stays on your device
- **Address Validation**: Validates Bitcoin and Ethereum addresses before transactions

## Usage

### Creating a New Wallet

1. Open the app and tap "Create New Wallet"
2. Write down your 12-word recovery phrase securely
3. Confirm you've saved the phrase
4. Your wallet is ready to use!

### Importing an Existing Wallet

1. Open the app and tap "Import Existing Wallet"
2. Enter your 12-word recovery phrase
3. Tap "Import Wallet"
4. Your wallet will be restored with all addresses

### Sending Cryptocurrency

1. Go to the "Send" tab
2. Select Bitcoin or Ethereum
3. Enter the recipient's address
4. Enter the amount to send
5. Review and confirm the transaction

### Receiving Cryptocurrency

1. Go to the "Receive" tab
2. Select Bitcoin or Ethereum
3. Share your address or QR code
4. The sender can use either to send you funds

## Development Notes

### Mock Implementation

This demo app includes mock implementations for:
- **Balance fetching**: Returns static demo balances
- **Transaction broadcasting**: Returns mock transaction hashes
- **Price data**: Shows placeholder USD values

### Production Implementation

For a production app, you would need to:

1. **Connect to real blockchain networks**:
   - Bitcoin: Use services like BlockCypher, Blockstream API, or run your own Bitcoin node
   - Ethereum: Use Infura, Alchemy, or other Ethereum providers

2. **Implement real transaction broadcasting**:
   - Construct and sign actual transactions
   - Broadcast to the respective networks
   - Handle transaction confirmations

3. **Add price feeds**:
   - Integrate with CoinGecko, CoinMarketCap, or other price APIs
   - Calculate real USD values for balances

4. **Enhanced security**:
   - Add biometric authentication
   - Implement transaction limits
   - Add multi-signature support

## API Integration Examples

### Bitcoin Integration
```javascript
// Example using BlockCypher API
const getBitcoinBalance = async (address) => {
  const response = await fetch(`https://api.blockcypher.com/v1/btc/main/addrs/${address}/balance`);
  const data = await response.json();
  return (data.balance / 100000000).toString(); // Convert satoshis to BTC
};
```

### Ethereum Integration
```javascript
// Example using Infura
const provider = new ethers.providers.JsonRpcProvider('https://mainnet.infura.io/v3/YOUR_API_KEY');

const getEthereumBalance = async (address) => {
  const balance = await provider.getBalance(address);
  return ethers.utils.formatEther(balance);
};
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Security Considerations

⚠️ **Important Security Notes**:

- Never share your private keys or mnemonic phrase
- Always verify recipient addresses before sending
- Test with small amounts first
- Keep your recovery phrase in a safe, offline location
- This is a demo app - use caution with real funds

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Disclaimer

This is a demo cryptocurrency wallet for educational purposes. While it implements security best practices, it should not be used with real funds without thorough testing and security audits. Cryptocurrency transactions are irreversible, and lost private keys cannot be recovered.

## Support

For questions or support, please open an issue on GitHub or contact the development team.

---

Built with ❤️ using React Native and Expo 