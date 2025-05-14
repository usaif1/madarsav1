// modules/error/components/OfflineDetector.tsx
import React, { useEffect } from 'react';
import { useErrorHandler } from '../hooks/useErrorHandler';

interface OfflineDetectorProps {
  children: React.ReactNode;
}

const OfflineDetector: React.FC<OfflineDetectorProps> = ({ children }) => {
  const { setupNetworkMonitoring } = useErrorHandler();
  
  useEffect(() => {
    // Setup network monitoring when component mounts
    const unsubscribe = setupNetworkMonitoring();
    
    // Cleanup when component unmounts
    return () => {
      unsubscribe();
    };
  }, [setupNetworkMonitoring]);
  
  return <>{children}</>;
};

export default OfflineDetector;