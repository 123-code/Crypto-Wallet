import React, { createContext, useContext, useState, useEffect } from 'react';
import { initializeLanguage, setLanguage as setAppLanguage, getCurrentLanguage, t } from './i18n';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('en');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initLanguage = async () => {
      await initializeLanguage();
      setLanguage(getCurrentLanguage());
      setIsLoading(false);
    };
    
    initLanguage();
  }, []);

  const changeLanguage = async (newLanguage) => {
    await setAppLanguage(newLanguage);
    setLanguage(newLanguage);
  };

  const translate = (key) => t(key);

  return (
    <LanguageContext.Provider 
      value={{ 
        language, 
        changeLanguage, 
        t: translate,
        isLoading 
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}; 