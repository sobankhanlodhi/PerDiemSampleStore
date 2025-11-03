
import { createMMKV } from 'react-native-mmkv'

export const storage = createMMKV();

export const StorageKeys = {
  TOKEN: 'auth_token',
  USER_INFO: 'user_info',
  AUTH_SOURCE: 'auth_source',
  TIMEZONE_PREFERENCE: 'timezone_preference',
  SELECTED_TIME_SLOT: 'selected_time_slot',
  STORE_TIMES: 'store_times',
  STORE_OVERRIDES: 'store_overrides',
  LAST_UPDATE: 'last_update',
} as const;


export const StorageHelper = {
  setToken: (token: string) => {
    storage.set(StorageKeys.TOKEN, token);
  },
  getToken: (): string | undefined => {
    return storage.getString(StorageKeys.TOKEN);
  },
  removeToken: () => {
    storage.remove(StorageKeys.TOKEN);
  },

  setUserInfo: (userInfo: { email: string; name?: string }) => {
    storage.set(StorageKeys.USER_INFO, JSON.stringify(userInfo));
  },
  getUserInfo: (): { email: string; name?: string } | null => {
    const userInfo = storage.getString(StorageKeys.USER_INFO);
    return userInfo ? JSON.parse(userInfo) : null;
  },
  removeUserInfo: () => {
    storage.remove(StorageKeys.USER_INFO);
  },

  setTimezonePreference: (preference: 'nyc' | 'local') => {
    storage.set(StorageKeys.TIMEZONE_PREFERENCE, preference);
  },
  getTimezonePreference: (): 'nyc' | 'local' => {
    return (storage.getString(StorageKeys.TIMEZONE_PREFERENCE) as 'nyc' | 'local') || 'nyc';
  },

  setSelectedTimeSlot: (slot: { date: { month: number; day: number }; timeSlot: string } | null) => {
    if (slot) {
      storage.set(StorageKeys.SELECTED_TIME_SLOT, JSON.stringify(slot));
    } else {
      storage.remove(StorageKeys.SELECTED_TIME_SLOT);
    }
  },

  getSelectedTimeSlot: (): { date: { month: number; day: number }; timeSlot: string } | null => {
    const data = storage.getString(StorageKeys.SELECTED_TIME_SLOT);
    return data ? JSON.parse(data) : null;
  },

  setStoreTimes: (storeTimes: any) => {
    storage.set(StorageKeys.STORE_TIMES, JSON.stringify(storeTimes));
    storage.set(StorageKeys.LAST_UPDATE, Date.now().toString());
  },
  getStoreTimes: (): any | null => {
    const data = storage.getString(StorageKeys.STORE_TIMES);
    return data ? JSON.parse(data) : null;
  },

  setStoreOverrides: (overrides: any) => {
    storage.set(StorageKeys.STORE_OVERRIDES, JSON.stringify(overrides));
  },
  getStoreOverrides: (): any | null => {
    const data = storage.getString(StorageKeys.STORE_OVERRIDES);
    return data ? JSON.parse(data) : null;
  },

  getLastUpdate: (): number | null => {
    const timestamp = storage.getString(StorageKeys.LAST_UPDATE);
    return timestamp ? parseInt(timestamp, 10) : null;
  },

  setAuthSource: (source: 'firebase' | 'api') => {
    storage.set(StorageKeys.AUTH_SOURCE, source);
  },
  getAuthSource: (): 'firebase' | 'api' | undefined => {
    return storage.getString(StorageKeys.AUTH_SOURCE) as 'firebase' | 'api' | undefined;
  },
  removeAuthSource: () => {
    storage.remove(StorageKeys.AUTH_SOURCE);
  },

  clearAuth: () => {
    storage.remove(StorageKeys.TOKEN);
    storage.remove(StorageKeys.USER_INFO);
    storage.remove(StorageKeys.AUTH_SOURCE);
  },

  clearAll: () => {
    storage.clearAll();
  },
};

