import React, { createContext, useContext, useState, ReactNode } from 'react';

interface QuranNavigationContextType {
  showTopTabs: boolean;
  showBottomTabs: boolean;
  setShowTopTabs: (show: boolean) => void;
  setShowBottomTabs: (show: boolean) => void;
  setTabsVisibility: (showTop: boolean, showBottom: boolean) => void;
}

const QuranNavigationContext = createContext<QuranNavigationContextType | undefined>(undefined);

export const useQuranNavigation = () => {
  const context = useContext(QuranNavigationContext);
  if (!context) {
    throw new Error('useQuranNavigation must be used within QuranNavigationProvider');
  }
  return context;
};

interface QuranNavigationProviderProps {
  children: ReactNode;
}

export const QuranNavigationProvider: React.FC<QuranNavigationProviderProps> = ({ children }) => {
  const [showTopTabs, setShowTopTabs] = useState(true);
  const [showBottomTabs, setShowBottomTabs] = useState(true);

  const setTabsVisibility = (showTop: boolean, showBottom: boolean) => {
    setShowTopTabs(showTop);
    setShowBottomTabs(showBottom);
  };

  return (
    <QuranNavigationContext.Provider value={{ 
      showTopTabs, 
      showBottomTabs, 
      setShowTopTabs, 
      setShowBottomTabs, 
      setTabsVisibility 
    }}>
      {children}
    </QuranNavigationContext.Provider>
  );
};

export default QuranNavigationContext; 