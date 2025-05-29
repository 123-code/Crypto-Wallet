import * as Localization from 'expo-localization';
import AsyncStorage from '@react-native-async-storage/async-storage';

const translations = {
  en: {
    // Welcome Screen
    appTitle: 'Crypto Wallet',
    appSubtitle: 'Secure Bitcoin & Ethereum wallet',
    createNewWallet: 'Create New Wallet',
    importExistingWallet: 'Import Existing Wallet',
    securityMessage: "Your keys, your crypto. We don't store your private keys.",
    
    // Main Navigation
    wallet: 'Wallet',
    send: 'Send',
    receive: 'Receive',
    settings: 'Settings',
    
    // Wallet Screen
    myWallet: 'My Wallet',
    totalBalance: 'Total Balance',
    loadingWallet: 'Loading wallet...',
    assets: 'Assets',
    address: 'Address:',
    swap: 'Swap',
    buy: 'Buy',
    
    // Send Screen
    sendCrypto: 'Send Crypto',
    selectCurrency: 'Select Currency',
    recipientAddress: 'Recipient Address',
    amount: 'Amount',
    scanQR: 'Scan QR',
    paste: 'Paste',
    available: 'Available',
    networkFee: 'Network Fee',
    total: 'Total',
    sendTransaction: 'Send Transaction',
    enterRecipientAddress: 'Enter recipient address',
    enterAmount: 'Enter amount',
    
    // Receive Screen
    receiveCrypto: 'Receive Crypto',
    yourAddress: 'Your Address',
    copyAddress: 'Copy Address',
    shareAddress: 'Share Address',
    addressCopied: 'Address copied to clipboard',
    
    // Settings Screen
    walletSettings: 'Wallet Settings',
    security: 'Security',
    viewSeedPhrase: 'View Seed Phrase',
    changePin: 'Change PIN',
    biometricAuth: 'Biometric Authentication',
    general: 'General',
    language: 'Language',
    currency: 'Currency',
    notifications: 'Notifications',
    about: 'About',
    version: 'Version',
    support: 'Support',
    privacyPolicy: 'Privacy Policy',
    termsOfService: 'Terms of Service',
    
    // Create Wallet Screen
    createWallet: 'Create Wallet',
    setupNewWallet: 'Set up your new wallet',
    generateSeedPhrase: 'Generate Seed Phrase',
    yourSeedPhrase: 'Your Seed Phrase',
    writeDownSeedPhrase: 'Write down your seed phrase in order. You will need it to recover your wallet.',
    confirmSeedPhrase: 'Confirm Seed Phrase',
    selectWordsInOrder: 'Select the words in the correct order',
    continue: 'Continue',
    walletCreated: 'Wallet Created Successfully!',
    
    // Import Wallet Screen
    importWallet: 'Import Wallet',
    enterSeedPhrase: 'Enter your 12-word seed phrase',
    seedPhrasePlaceholder: 'Enter your seed phrase here...',
    importButton: 'Import Wallet',
    invalidSeedPhrase: 'Invalid seed phrase',
    
    // Common
    error: 'Error',
    success: 'Success',
    cancel: 'Cancel',
    ok: 'OK',
    yes: 'Yes',
    no: 'No',
    loading: 'Loading...',
    retry: 'Retry',
    
    // Error Messages
    failedToLoadWallet: 'Failed to load wallet data',
    failedToSend: 'Failed to send transaction',
    insufficientFunds: 'Insufficient funds',
    invalidAddress: 'Invalid address',
    invalidAmount: 'Invalid amount',
  },
  
  es: {
    // Welcome Screen
    appTitle: 'Monedero Cripto',
    appSubtitle: 'Monedero seguro de Bitcoin y Ethereum',
    createNewWallet: 'Crear Nueva Cartera',
    importExistingWallet: 'Importar Cartera Existente',
    securityMessage: 'Tus claves, tu cripto. No almacenamos tus claves privadas.',
    
    // Main Navigation
    wallet: 'Cartera',
    send: 'Enviar',
    receive: 'Recibir',
    settings: 'Ajustes',
    
    // Wallet Screen
    myWallet: 'Mi Cartera',
    totalBalance: 'Saldo Total',
    loadingWallet: 'Cargando cartera...',
    assets: 'Activos',
    address: 'Dirección:',
    swap: 'Intercambiar',
    buy: 'Comprar',
    
    // Send Screen
    sendCrypto: 'Enviar Cripto',
    selectCurrency: 'Seleccionar Moneda',
    recipientAddress: 'Dirección del Destinatario',
    amount: 'Cantidad',
    scanQR: 'Escanear QR',
    paste: 'Pegar',
    available: 'Disponible',
    networkFee: 'Comisión de Red',
    total: 'Total',
    sendTransaction: 'Enviar Transacción',
    enterRecipientAddress: 'Ingresa la dirección del destinatario',
    enterAmount: 'Ingresa la cantidad',
    
    // Receive Screen
    receiveCrypto: 'Recibir Cripto',
    yourAddress: 'Tu Dirección',
    copyAddress: 'Copiar Dirección',
    shareAddress: 'Compartir Dirección',
    addressCopied: 'Dirección copiada al portapapeles',
    
    // Settings Screen
    walletSettings: 'Configuración de Cartera',
    security: 'Seguridad',
    viewSeedPhrase: 'Ver Frase Semilla',
    changePin: 'Cambiar PIN',
    biometricAuth: 'Autenticación Biométrica',
    general: 'General',
    language: 'Idioma',
    currency: 'Moneda',
    notifications: 'Notificaciones',
    about: 'Acerca de',
    version: 'Versión',
    support: 'Soporte',
    privacyPolicy: 'Política de Privacidad',
    termsOfService: 'Términos de Servicio',
    
    // Create Wallet Screen
    createWallet: 'Crear Cartera',
    setupNewWallet: 'Configura tu nueva cartera',
    generateSeedPhrase: 'Generar Frase Semilla',
    yourSeedPhrase: 'Tu Frase Semilla',
    writeDownSeedPhrase: 'Escribe tu frase semilla en orden. La necesitarás para recuperar tu cartera.',
    confirmSeedPhrase: 'Confirmar Frase Semilla',
    selectWordsInOrder: 'Selecciona las palabras en el orden correcto',
    continue: 'Continuar',
    walletCreated: '¡Cartera Creada Exitosamente!',
    
    // Import Wallet Screen
    importWallet: 'Importar Cartera',
    enterSeedPhrase: 'Ingresa tu frase semilla de 12 palabras',
    seedPhrasePlaceholder: 'Ingresa tu frase semilla aquí...',
    importButton: 'Importar Cartera',
    invalidSeedPhrase: 'Frase semilla inválida',
    
    // Common
    error: 'Error',
    success: 'Éxito',
    cancel: 'Cancelar',
    ok: 'Aceptar',
    yes: 'Sí',
    no: 'No',
    loading: 'Cargando...',
    retry: 'Reintentar',
    
    // Error Messages
    failedToLoadWallet: 'Error al cargar los datos de la cartera',
    failedToSend: 'Error al enviar la transacción',
    insufficientFunds: 'Fondos insuficientes',
    invalidAddress: 'Dirección inválida',
    invalidAmount: 'Cantidad inválida',
  }
};

let currentLanguage = 'en';

export const initializeLanguage = async () => {
  try {
    // Check for stored language preference
    const storedLanguage = await AsyncStorage.getItem('app_language');
    
    if (storedLanguage) {
      currentLanguage = storedLanguage;
    } else {
      // Use device language if available, otherwise default to English
      const deviceLanguage = Localization.locale.split('-')[0]; // Get language code from locale (e.g., 'es' from 'es-ES')
      
      if (deviceLanguage === 'es') {
        currentLanguage = 'es';
      } else {
        currentLanguage = 'en';
      }
      
      // Save the detected/default language
      await AsyncStorage.setItem('app_language', currentLanguage);
    }
  } catch (error) {
    console.error('Error initializing language:', error);
    currentLanguage = 'en';
  }
};

export const setLanguage = async (language) => {
  try {
    currentLanguage = language;
    await AsyncStorage.setItem('app_language', language);
  } catch (error) {
    console.error('Error setting language:', error);
  }
};

export const getCurrentLanguage = () => currentLanguage;

export const t = (key) => {
  return translations[currentLanguage]?.[key] || translations['en'][key] || key;
};

export const getAvailableLanguages = () => [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'es', name: 'Spanish', nativeName: 'Español' }
]; 