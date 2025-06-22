// src/types/netinfo.d.ts
declare module '@react-native-community/netinfo' {
    export interface NetInfoState {
      type: string;
      isConnected: boolean;
      isInternetReachable: boolean;
      details: any;
    }
  
    export interface NetInfoSubscription {
      (): void;
    }
  
    export function addEventListener(
      listener: (state: NetInfoState) => void
    ): NetInfoSubscription;
  
    export function fetch(): Promise<NetInfoState>;
  }