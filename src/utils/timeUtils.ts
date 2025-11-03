
export const getTimeInTimezone = (timezone: string = 'America/New_York'): Date => {
  const now = new Date();
  const timeString = now.toLocaleString('en-US', { timeZone: timezone });
  return new Date(timeString);
};


export const getNYCGreeting = (hour: number): string => {
  if (hour >= 5 && hour < 10) {
    return 'Good Morning, NYC!';
  } else if (hour >= 10 && hour < 12) {
    return 'Late Morning Vibes, NYC!';
  } else if (hour >= 12 && hour < 17) {
    return 'Good Afternoon, NYC!';
  } else if (hour >= 17 && hour < 21) {
    return 'Good Evening, NYC!';
  } else {
    return 'Night Owl in NYC!';
  }
};


export const getGreeting = (preference: 'nyc' | 'local'): string => {
  const timezone = preference === 'nyc' ? 'America/New_York' : Intl.DateTimeFormat().resolvedOptions().timeZone;
  const date = getTimeInTimezone(timezone);
  const hour = date.getHours();
  
  if (preference === 'nyc') {
    return getNYCGreeting(hour);
  } else {
    const localHour = new Date().getHours();
    if (localHour >= 5 && localHour < 10) {
      return 'Good Morning!';
    } else if (localHour >= 10 && localHour < 12) {
      return 'Late Morning Vibes!';
    } else if (localHour >= 12 && localHour < 17) {
      return 'Good Afternoon!';
    } else if (localHour >= 17 && localHour < 21) {
      return 'Good Evening!';
    } else {
      return 'Night Owl!';
    }
  }
};


export const generateDateList = (count: number = 30): Array<{ date: Date; month: number; day: number }> => {
  const dates: Array<{ date: Date; month: number; day: number }> = [];
  const today = new Date();
  
  for (let i = 0; i < count; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    dates.push({
      date,
      month: date.getMonth() + 1, // 1-12
      day: date.getDate(),
    });
  }
  
  return dates;
};


export const generateTimeSlots = (): string[] => {
  const slots: string[] = [];
  
  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += 15) {
      const h = hour.toString().padStart(2, '0');
      const m = minute.toString().padStart(2, '0');
      slots.push(`${h}:${m}`);
    }
  }
  
  return slots;
};


export const formatTimeSlot = (timeSlot: string): string => {
  const [hour, minute] = timeSlot.split(':').map(Number);
  const period = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  return `${displayHour}:${minute.toString().padStart(2, '0')} ${period}`;
};


export const getNextStoreOpening = (storeTimes: any, currentTime: Date): Date | null => {
  if (!storeTimes || !Array.isArray(storeTimes) || storeTimes.length === 0) return null;

  const currentHour = currentTime.getHours();
  const currentMinute = currentTime.getMinutes();
  const currentDay = currentTime.getDay();

  const todaySchedules = storeTimes.filter(
    (schedule: any) => schedule.day_of_week === currentDay && schedule.is_open === true
  );
  
  if (todaySchedules.length === 0) {
    return findNextOpenDay(storeTimes, currentTime);
  }

  let earliestOpening: Date | null = null;

  for (const schedule of todaySchedules) {
    if (!schedule.start_time) continue;
    
    const [openHour, openMinute] = schedule.start_time.split(':').map(Number);
    const openingTime = new Date(currentTime);
    openingTime.setHours(openHour, openMinute, 0, 0);

    if (openingTime > currentTime && (!earliestOpening || openingTime < earliestOpening)) {
      earliestOpening = openingTime;
    }
  }

  if (earliestOpening) {
    return earliestOpening;
  }

  return findNextOpenDay(storeTimes, currentTime);
};


const findNextOpenDay = (storeTimes: any, currentTime: Date): Date | null => {
  const currentDay = currentTime.getDay();
  
  for (let i = 1; i <= 7; i++) {
    const checkDay = (currentDay + i) % 7;
    const checkDate = new Date(currentTime);
    checkDate.setDate(checkDate.getDate() + i);
    
    const daySchedules = storeTimes.filter(
      (schedule: any) => schedule.day_of_week === checkDay && schedule.is_open === true
    );
    
    if (daySchedules.length > 0) {
      let earliestTime: Date | null = null;
      
      for (const schedule of daySchedules) {
        if (!schedule.start_time) {
          const openDate = new Date(checkDate);
          openDate.setHours(0, 0, 0, 0);
          if (!earliestTime || openDate < earliestTime) {
            earliestTime = openDate;
          }
        } else {
          const [openHour, openMinute] = schedule.start_time.split(':').map(Number);
          const openDate = new Date(checkDate);
          openDate.setHours(openHour, openMinute, 0, 0);
          if (!earliestTime || openDate < earliestTime) {
            earliestTime = openDate;
          }
        }
      }
      
      if (earliestTime) {
        return earliestTime;
      }
    }
  }
  
  return null;
};

