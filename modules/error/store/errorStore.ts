// modules/error/store/errorStore.ts
import { create } from 'zustand';
import { ErrorType, AppError } from '@/api/utils/errorHandling';

// Error state
interface ErrorState {
  errors: AppError[];
  hasErrors: boolean;
  isOffline: boolean;
}

// Error actions
interface ErrorActions {
  addError: (error: AppError) => void;
  removeError: (index: number) => void;
  clearErrors: () => void;
  setOffline: (isOffline: boolean) => void;
}

// Initial state
const initialState: ErrorState = {
  errors: [],
  hasErrors: false,
  isOffline: false,
};

// Create error store
export const useErrorStore = create<ErrorState & ErrorActions>((set, get) => ({
  ...initialState,
  
  // Add error to the queue
  addError: (error) => set((state) => {
    // Don't add duplicate errors
    const isDuplicate = state.errors.some(
      (e) => e.message === error.message && e.type === error.type
    );
    
    if (isDuplicate) return state;
    
    return {
      errors: [...state.errors, error],
      hasErrors: true,
    };
  }),
  
  // Remove error by index
  removeError: (index) => set((state) => {
    const newErrors = [...state.errors];
    newErrors.splice(index, 1);
    
    return {
      errors: newErrors,
      hasErrors: newErrors.length > 0,
    };
  }),
  
  // Clear all errors
  clearErrors: () => set({
    errors: [],
    hasErrors: false,
  }),
  
  // Set offline status
  setOffline: (isOffline) => set({
    isOffline,
  }),
}));

// Export a hook to use the error store
export const useError = () => {
  const {
    errors,
    hasErrors,
    isOffline,
    addError,
    removeError,
    clearErrors,
    setOffline,
  } = useErrorStore();
  
  return {
    errors,
    hasErrors,
    isOffline,
    addError,
    removeError,
    clearErrors,
    setOffline,
  };
};