/**
 * Custom hook for localStorage with versioning support
 * Syncs state with localStorage automatically
 */

import { useState, useEffect, useCallback } from 'react';
import { saveToStorage, loadFromStorage } from '@/utils/storage';

export function useLocalStorage<T>(key: string, initialValue: T) {
  // Initialize state with value from localStorage or initialValue
  const [storedValue, setStoredValue] = useState<T>(() => {
    return loadFromStorage(key, initialValue);
  });

  // Update localStorage when state changes
  useEffect(() => {
    saveToStorage(key, storedValue);
  }, [key, storedValue]);

  // Wrapped setValue to match useState API
  const setValue = useCallback((value: T | ((val: T) => T)) => {
    setStoredValue(prevValue => {
      const newValue = value instanceof Function ? value(prevValue) : value;
      return newValue;
    });
  }, []);

  return [storedValue, setValue] as const;
}
