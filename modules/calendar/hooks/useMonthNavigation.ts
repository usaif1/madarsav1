import { useState, useCallback } from 'react';

interface MonthNavigationState {
  month: number; // 0-based (0 = January, 11 = December)
  year: number;
}

interface UseMonthNavigationReturn {
  currentMonth: number;
  currentYear: number;
  navigateToNext: () => void;
  navigateToPrevious: () => void;
  navigateToMonthYear: (month: number, year: number) => void;
  navigateToToday: () => void;
  getMonthName: () => string;
  getYearString: () => string;
}

const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export const useMonthNavigation = (
  initialMonth?: number,
  initialYear?: number
): UseMonthNavigationReturn => {
  const today = new Date();
  
  const [state, setState] = useState<MonthNavigationState>({
    month: initialMonth ?? today.getMonth(),
    year: initialYear ?? today.getFullYear(),
  });

  const navigateToNext = useCallback(() => {
    setState(prev => {
      const newMonth = prev.month + 1;
      if (newMonth > 11) {
        // December -> January of next year
        return { month: 0, year: prev.year + 1 };
      }
      return { month: newMonth, year: prev.year };
    });
  }, []);

  const navigateToPrevious = useCallback(() => {
    setState(prev => {
      const newMonth = prev.month - 1;
      if (newMonth < 0) {
        // January -> December of previous year
        return { month: 11, year: prev.year - 1 };
      }
      return { month: newMonth, year: prev.year };
    });
  }, []);

  const navigateToMonthYear = useCallback((month: number, year: number) => {
    setState({ month, year });
  }, []);

  const navigateToToday = useCallback(() => {
    const today = new Date();
    setState({
      month: today.getMonth(),
      year: today.getFullYear(),
    });
  }, []);

  const getMonthName = useCallback(() => {
    return monthNames[state.month];
  }, [state.month]);

  const getYearString = useCallback(() => {
    return state.year.toString();
  }, [state.year]);

  return {
    currentMonth: state.month,
    currentYear: state.year,
    navigateToNext,
    navigateToPrevious,
    navigateToMonthYear,
    navigateToToday,
    getMonthName,
    getYearString,
  };
}; 