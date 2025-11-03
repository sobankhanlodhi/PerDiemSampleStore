/**
 * Unit tests for timeUtils
 */

import {
  getTimeInTimezone,
  getNYCGreeting,
  getGreeting,
  generateDateList,
  generateTimeSlots,
  formatTimeSlot,
} from '../utils/timeUtils';

describe('timeUtils', () => {
  describe('getTimeInTimezone', () => {
    it('should return a Date object', () => {
      const date = getTimeInTimezone('America/New_York');
      expect(date).toBeInstanceOf(Date);
    });

    it('should return different times for different timezones', () => {
      const nycTime = getTimeInTimezone('America/New_York');
      const laTime = getTimeInTimezone('America/Los_Angeles');
      expect(nycTime).not.toBe(laTime);
    });
  });

  describe('getNYCGreeting', () => {
    it('should return morning greeting for hours 5-9', () => {
      expect(getNYCGreeting(5)).toBe('Good Morning, NYC!');
      expect(getNYCGreeting(9)).toBe('Good Morning, NYC!');
    });

    it('should return late morning greeting for hours 10-11', () => {
      expect(getNYCGreeting(10)).toBe('Late Morning Vibes, NYC!');
      expect(getNYCGreeting(11)).toBe('Late Morning Vibes, NYC!');
    });

    it('should return afternoon greeting for hours 12-16', () => {
      expect(getNYCGreeting(12)).toBe('Good Afternoon, NYC!');
      expect(getNYCGreeting(16)).toBe('Good Afternoon, NYC!');
    });

    it('should return evening greeting for hours 17-20', () => {
      expect(getNYCGreeting(17)).toBe('Good Evening, NYC!');
      expect(getNYCGreeting(20)).toBe('Good Evening, NYC!');
    });

    it('should return night greeting for other hours', () => {
      expect(getNYCGreeting(21)).toBe('Night Owl in NYC!');
      expect(getNYCGreeting(4)).toBe('Night Owl in NYC!');
    });
  });

  describe('getGreeting', () => {
    it('should return NYC greeting when preference is nyc', () => {
      const greeting = getGreeting('nyc');
      expect(greeting).toContain('NYC');
    });

    it('should return greeting when preference is local', () => {
      const greeting = getGreeting('local');
      expect(typeof greeting).toBe('string');
      expect(greeting.length).toBeGreaterThan(0);
    });
  });

  describe('generateDateList', () => {
    it('should generate correct number of dates', () => {
      const dates = generateDateList(30);
      expect(dates).toHaveLength(30);
    });

    it('should include month and day properties', () => {
      const dates = generateDateList(1);
      expect(dates[0]).toHaveProperty('month');
      expect(dates[0]).toHaveProperty('day');
      expect(dates[0]).toHaveProperty('date');
    });

    it('should start from today', () => {
      const dates = generateDateList(1);
      const today = new Date();
      expect(dates[0].month).toBe(today.getMonth() + 1);
      expect(dates[0].day).toBe(today.getDate());
    });
  });

  describe('generateTimeSlots', () => {
    it('should generate 96 time slots (24 hours * 4)', () => {
      const slots = generateTimeSlots();
      expect(slots).toHaveLength(96);
    });

    it('should generate slots in HH:MM format', () => {
      const slots = generateTimeSlots();
      expect(slots[0]).toMatch(/^\d{2}:\d{2}$/);
    });

    it('should include all 15-minute intervals', () => {
      const slots = generateTimeSlots();
      expect(slots).toContain('00:00');
      expect(slots).toContain('00:15');
      expect(slots).toContain('00:30');
      expect(slots).toContain('00:45');
      expect(slots).toContain('23:45');
    });
  });

  describe('formatTimeSlot', () => {
    it('should format 24-hour time to 12-hour format with AM/PM', () => {
      expect(formatTimeSlot('00:00')).toBe('12:00 AM');
      expect(formatTimeSlot('12:00')).toBe('12:00 PM');
      expect(formatTimeSlot('13:30')).toBe('1:30 PM');
      expect(formatTimeSlot('09:15')).toBe('9:15 AM');
    });
  });
});

