// modules/auth/storage/mmkvStorage.ts
import { MMKV } from 'react-native-mmkv';

// Create MMKV instance
export const storage = new MMKV({ id: 'auth-storage' });

// Create storage interface for Zustand persist
export const mmkvStorage = {
  setItem: (name: string, value: string) => {
    storage.set(name, value);
    return Promise.resolve(true);
  },
  getItem: (name: string) => {
    const value = storage.getString(name);
    return Promise.resolve(value ?? null);
  },
  removeItem: (name: string) => {
    storage.delete(name);
    return Promise.resolve();
  },
};