

import { StorageHelper } from '../utils/storage';
import { base64Encode } from '../utils/base64';

const API_BASE_URL = 'https://coding-challenge-pd-1a25b1a14f34.herokuapp.com';
const BASIC_AUTH_USERNAME = 'perdiem';
const BASIC_AUTH_PASSWORD = 'perdiem';


const getBasicAuthHeader = (): string => {
  const credentials = `${BASIC_AUTH_USERNAME}:${BASIC_AUTH_PASSWORD}`;
  return `Basic ${base64Encode(credentials)}`;
};


export const fetchStoreTimes = async (useCache: boolean = true): Promise<any> => {
  if (useCache) {
    const cached = StorageHelper.getStoreTimes();
    if (cached) {
      return { success: true, data: cached, cached: true };
    }
  }

  try {
    const response = await fetch(`${API_BASE_URL}/store-times/`, {
      method: 'GET',
      headers: {
        Authorization: getBasicAuthHeader(),
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch store times: ${response.statusText}`);
    }

    const data = await response.json();

    StorageHelper.setStoreTimes(data);

    return { success: true, data, cached: false };
  } catch (error: any) {
    const cached = StorageHelper.getStoreTimes();
    if (cached) {
      return { success: true, data: cached, cached: true, error: error.message };
    }

    return {
      success: false,
      error: error.message || 'Failed to fetch store times',
      data: null,
    };
  }
};


export const fetchStoreOverrides = async (
  month: number,
  day: number,
  useCache: boolean = true
): Promise<any> => {
  if (useCache) {
    const allOverrides = StorageHelper.getStoreOverrides();
    if (allOverrides && allOverrides[`${month}-${day}`]) {
      return {
        success: true,
        data: allOverrides[`${month}-${day}`],
        cached: true,
      };
    }
  }

  try {
    const response = await fetch(`${API_BASE_URL}/store-overrides/date/${month}/${day}`, {
      method: 'GET',
      headers: {
        Authorization: getBasicAuthHeader(),
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return { success: true, data: [], cached: false };
      }
      throw new Error(`Failed to fetch store overrides: ${response.statusText}`);
    }

    const data = await response.json();

    const allOverrides = StorageHelper.getStoreOverrides() || {};
    allOverrides[`${month}-${day}`] = Array.isArray(data) ? data : [data];
    StorageHelper.setStoreOverrides(allOverrides);

    return { success: true, data: Array.isArray(data) ? data : [data], cached: false };
  } catch (error: any) {
    const allOverrides = StorageHelper.getStoreOverrides();
    if (allOverrides && allOverrides[`${month}-${day}`]) {
      return {
        success: true,
        data: allOverrides[`${month}-${day}`],
        cached: true,
        error: error.message,
      };
    }

    return {
      success: false,
      error: error.message || 'Failed to fetch store overrides',
      data: [],
    };
  }
};


export const isStoreOpen = (
  storeTimes: any,
  overrides: any,
  month: number,
  day: number,
  timeSlot: string
): boolean => {
  if (!storeTimes || !Array.isArray(storeTimes)) {
    return false;
  }

  const date = new Date();
  date.setMonth(month - 1);
  date.setDate(day);
  const dayOfWeek = date.getDay();

  if (overrides && Array.isArray(overrides) && overrides.length > 0) {
    const override = overrides.find(
      (o: any) => o.month === month && o.day === day
    );

    if (override) {
      if (override.is_open === false) {
        return false;
      }
      if (override.start_time && override.end_time && override.is_open === true) {
        return isTimeInRange(timeSlot, override.start_time, override.end_time);
      }
      if (override.is_open === true) {
        return true;
      }
    }
  }

  const schedules = storeTimes.filter((s: any) => s.day_of_week === dayOfWeek);

  if (schedules.length === 0) {
    return false;
  }

  for (const schedule of schedules) {
    if (schedule.is_open === false) {
      continue;
    }

    if (schedule.start_time && schedule.end_time && schedule.is_open === true) {
      if (isTimeInRange(timeSlot, schedule.start_time, schedule.end_time)) {
        return true;
      }
    }

    if (schedule.is_open === true && !schedule.start_time && !schedule.end_time) {
      return true;
    }
  }

  return false;
};

const isTimeInRange = (time: string, openTime: string, closeTime: string): boolean => {
  const [timeHour, timeMinute] = time.split(':').map(Number);
  const [openHour, openMinute] = openTime.split(':').map(Number);
  const [closeHour, closeMinute] = closeTime.split(':').map(Number);

  const timeMinutes = timeHour * 60 + timeMinute;
  const openMinutes = openHour * 60 + openMinute;
  const closeMinutes = closeHour * 60 + closeMinute;

  return timeMinutes >= openMinutes && timeMinutes < closeMinutes;
};

