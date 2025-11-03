/**
 * Unit tests for storeApi
 */

import { isStoreOpen } from '../api/storeApi';

describe('storeApi', () => {
  describe('isStoreOpen', () => {
    const mockStoreTimes = [
      { day: 0, closed: false, openTime: '09:00', closeTime: '17:00' }, // Sunday
      { day: 1, closed: false, openTime: '09:00', closeTime: '17:00' }, // Monday
      { day: 2, closed: true }, // Tuesday - closed
      { day: 3, closed: false, openTime: '10:00', closeTime: '18:00' }, // Wednesday
    ];

    it('should return true when store is open during business hours', () => {
      const date = new Date(2024, 0, 7); // Sunday, Jan 7
      const dayOfWeek = date.getDay(); // 0 = Sunday
      const isOpen = isStoreOpen(mockStoreTimes, null, 1, 7, '10:00');
      expect(isOpen).toBe(true);
    });

    it('should return false when time is before opening', () => {
      const isOpen = isStoreOpen(mockStoreTimes, null, 1, 7, '08:00');
      expect(isOpen).toBe(false);
    });

    it('should return false when time is after closing', () => {
      const isOpen = isStoreOpen(mockStoreTimes, null, 1, 7, '18:00');
      expect(isOpen).toBe(false);
    });

    it('should return false when store is closed for the day', () => {
      const date = new Date(2024, 0, 9); // Tuesday, Jan 9
      const dayOfWeek = date.getDay(); // 2 = Tuesday
      const isOpen = isStoreOpen(mockStoreTimes, null, 1, 9, '12:00');
      expect(isOpen).toBe(false);
    });

    it('should respect override when store is closed', () => {
      const override = { closed: true };
      const isOpen = isStoreOpen(mockStoreTimes, override, 1, 7, '10:00');
      expect(isOpen).toBe(false);
    });

    it('should respect override with custom times', () => {
      const override = { openTime: '11:00', closeTime: '15:00' };
      const isOpen = isStoreOpen(mockStoreTimes, override, 1, 7, '12:00');
      expect(isOpen).toBe(true);
    });

    it('should return false when storeTimes is null', () => {
      const isOpen = isStoreOpen(null, null, 1, 7, '10:00');
      expect(isOpen).toBe(false);
    });

    it('should return false when storeTimes is empty array', () => {
      const isOpen = isStoreOpen([], null, 1, 7, '10:00');
      expect(isOpen).toBe(false);
    });
  });
});

