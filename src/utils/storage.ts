/**
 * Utility functions for working with localStorage
 */

// Check if localStorage is available
export const isLocalStorageAvailable = (): boolean => {
  try {
    const testKey = '__test__';
    localStorage.setItem(testKey, testKey);
    localStorage.removeItem(testKey);
    return true;
  } catch (e) {
    return false;
  }
};

// Save data to localStorage with error handling
export const saveToStorage = <T>(key: string, data: T): boolean => {
  if (!isLocalStorageAvailable()) {
    console.error('localStorage is not available');
    return false;
  }

  try {
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (error) {
    if (error instanceof DOMException && (
      // everything except Firefox
      error.code === 22 ||
      // Firefox
      error.code === 1014 ||
      // test name field too, because code might not be present
      error.name === 'QuotaExceededError' ||
      error.name === 'NS_ERROR_DOM_QUOTA_REACHED'
    )) {
      console.error('localStorage quota exceeded');
    } else {
      console.error('Error saving to localStorage:', error);
    }
    return false;
  }
};

// Load data from localStorage with error handling
export const loadFromStorage = <T>(key: string, defaultValue: T): T => {
  if (!isLocalStorageAvailable()) {
    console.error('localStorage is not available');
    return defaultValue;
  }

  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error('Error loading from localStorage:', error);
    return defaultValue;
  }
};

// Remove data from localStorage with error handling
export const removeFromStorage = (key: string): boolean => {
  if (!isLocalStorageAvailable()) {
    console.error('localStorage is not available');
    return false;
  }

  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error('Error removing from localStorage:', error);
    return false;
  }
};