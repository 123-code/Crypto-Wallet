import './global';
import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';

// Import screens
import WalletScreen from './src/screens/WalletScreen';
import SendScreen from './src/screens/SendScreen';
import ReceiveScreen from './src/screens/ReceiveScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import CreateWalletScreen from './src/screens/CreateWalletScreen';
import ImportWalletScreen from './src/screens/ImportWalletScreen';
import WelcomeScreen from './src/screens/WelcomeScreen';

// Import language context
import { LanguageProvider, useLanguage } from './src/utils/LanguageContext';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function MainTabs() {
  const { t } = useLanguage();
  
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Wallet') {
            iconName = focused ? 'wallet' : 'wallet-outline';
          } else if (route.name === 'Send') {
            iconName = focused ? 'send' : 'send-outline';
          } else if (route.name === 'Receive') {
            iconName = focused ? 'download' : 'download-outline';
          } else if (route.name === 'Settings') {
            iconName = focused ? 'settings' : 'settings-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen 
        name="Wallet" 
        component={WalletScreen} 
        options={{ tabBarLabel: t('wallet') }}
      />
      <Tab.Screen 
        name="Send" 
        component={SendScreen} 
        options={{ tabBarLabel: t('send') }}
      />
      <Tab.Screen 
        name="Receive" 
        component={ReceiveScreen} 
        options={{ tabBarLabel: t('receive') }}
      />
      <Tab.Screen 
        name="Settings" 
        component={SettingsScreen} 
        options={{ tabBarLabel: t('settings') }}
      />
    </Tab.Navigator>
  );
}

function AppContent() {
  const [hasWallet, setHasWallet] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { isLoading: languageLoading } = useLanguage();

  useEffect(() => {
    checkWalletExists();
  }, []);

  const checkWalletExists = async () => {
    try {
      const mnemonic = await SecureStore.getItemAsync('wallet_mnemonic');
      setHasWallet(!!mnemonic);
    } catch (error) {
      console.error('Error checking wallet existence:', error);
      setHasWallet(false);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading || languageLoading) {
    return null; // Or a loading screen
  }

  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!hasWallet ? (
          <>
            <Stack.Screen name="Welcome" component={WelcomeScreen} />
            <Stack.Screen name="CreateWallet" component={CreateWalletScreen} />
            <Stack.Screen name="ImportWallet" component={ImportWalletScreen} />
          </>
        ) : (
          <Stack.Screen name="MainTabs" component={MainTabs} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
} 