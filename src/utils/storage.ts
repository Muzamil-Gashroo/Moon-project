/**
 * Versioned localStorage utility
 * Implements migration logic for schema changes
 */

import { safeJsonParse } from './helpers';

const STORAGE_VERSION = 1;
const VERSION_KEY = 'monnn_storage_version';

interface StorageData<T> {
  version: number;
  data: T;
  timestamp: number;
}

/**
 * Migration functions for different versions
 * Add new migrations as schema evolves
 */
const migrations: Record<number, (data: any) => any> = {
  // Example: migrating from v0 (no version) to v1
  0: (data: any) => {
    // If old cart format, transform to new format
    if (data.cart && !data.cart.items) {
      return {
        ...data,
        cart: {
          items: data.cart,
          totalItems: 0,
          totalPrice: 0,
        },
      };
    }
    return data;
  },
};

/**
 * Migrate data through all versions
 */
const migrateData = (data: any, fromVersion: number): any => {
  let migratedData = data;
  for (let v = fromVersion; v < STORAGE_VERSION; v++) {
    if (migrations[v]) {
      migratedData = migrations[v](migratedData);
    }
  }
  return migratedData;
};

/**
 * Save data to localStorage with versioning
 */
export const saveToStorage = <T>(key: string, data: T): void => {
  try {
    const storageData: StorageData<T> = {
      version: STORAGE_VERSION,
      data,
      timestamp: Date.now(),
    };
    localStorage.setItem(key, JSON.stringify(storageData));
    localStorage.setItem(VERSION_KEY, STORAGE_VERSION.toString());
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

/**
 * Load data from localStorage with migration support
 */
export const loadFromStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(key);
    if (!item) return defaultValue;

    const storageData = safeJsonParse<StorageData<T>>(item, {
      version: 0,
      data: defaultValue,
      timestamp: Date.now(),
    });

    // Check if migration is needed
    if (storageData.version < STORAGE_VERSION) {
      const migratedData = migrateData(storageData.data, storageData.version);
      saveToStorage(key, migratedData);
      return migratedData;
    }

    return storageData.data;
  } catch (error) {
    console.error('Error loading from localStorage:', error);
    return defaultValue;
  }
};

/**
 * Remove item from localStorage
 */
export const removeFromStorage = (key: string): void => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Error removing from localStorage:', error);
  }
};

/**
 * Clear all app storage
 */
export const clearStorage = (): void => {
  try {
    const keys = Object.keys(localStorage).filter(key => key.startsWith('monnn_'));
    keys.forEach(key => localStorage.removeItem(key));
  } catch (error) {
    console.error('Error clearing localStorage:', error);
  }
};
