

import notifee, { AndroidImportance, TriggerType } from '@notifee/react-native';
import { getNextStoreOpening } from './timeUtils';


export const requestNotificationPermissions = async (): Promise<boolean> => {
  try {
    const settings = await notifee.requestPermission();
    return settings.authorizationStatus >= 1;
  } catch (error) {
    console.error('Error requesting notification permissions:', error);
    return false;
  }
};

export const scheduleStoreOpeningNotification = async (
  storeTimes: any
): Promise<void> => {
  try {
    await notifee.cancelAllNotifications();
    const nycTime = new Date(
      new Date().toLocaleString('en-US', { timeZone: 'America/New_York' })
    );

    const nextOpening = getNextStoreOpening(storeTimes, nycTime);
    if (!nextOpening) {
      console.log('No store opening found');
      return;
    }

    const notificationTime = new Date(nextOpening);
    notificationTime.setHours(notificationTime.getHours() - 1);

    if (notificationTime <= new Date()) {
      console.log('Notification time has already passed');
      return;
    }

    const triggerTimestamp = Math.floor(notificationTime.getTime());

    const channelId = await notifee.createChannel({
      id: 'store-opening',
      name: 'Store Opening Reminders',
      importance: AndroidImportance.HIGH,
    });

    const tempNotificationTime = new Date(Date.now());
    tempNotificationTime.setSeconds(tempNotificationTime.getSeconds() + 10);



    await notifee.createTriggerNotification(
      {
        title: 'Store Opening Soon!',
        body: 'The store will open in 1 hour.',
        android: {
          channelId,
          importance: AndroidImportance.HIGH,
          pressAction: {
            id: 'default',
          },
        },
        ios: {
          sound: 'default',
        },
      },
      {
        type: TriggerType.TIMESTAMP,
        timestamp: triggerTimestamp,
      }
    );

    console.log('Notification scheduled:', notificationTime.toISOString());
  } catch (error) {
    console.error('Error scheduling notification:', error);
  }
};

export const scheduleWelcomeNotification = async (): Promise<void> => {
  try {
    await notifee.cancelAllNotifications();

    const channelId = await notifee.createChannel({
      id: 'store-welcome',
      name: 'Store Welcome',
      importance: AndroidImportance.DEFAULT,
    });

    const tempNotificationTime = new Date(Date.now());
    tempNotificationTime.setSeconds(tempNotificationTime.getSeconds() + 5);

    const tempTriggerTimestamp = tempNotificationTime.getTime();

    await notifee.createTriggerNotification(
      {
        title: 'Hi!',
        body: 'Welcome to PerDiem Sample Store.',
        android: {
          channelId,
          importance: AndroidImportance.DEFAULT,
          pressAction: {
            id: 'default',
          },
        },
        ios: {
          sound: 'default',
        },
      },
      {
        type: TriggerType.TIMESTAMP,
        timestamp: tempTriggerTimestamp,
      }
    );

    console.log('Welcome Notification scheduled timestamp:', tempNotificationTime.toISOString());
  } catch (error) {
    console.error('Error Welcome notification:', error);
  }
};

export const cancelAllNotifications = async (): Promise<void> => {
  try {
    await notifee.cancelAllNotifications();
  } catch (error) {
    console.error('Error canceling notifications:', error);
  }
};


export const initializeNotifications = async (storeTimes: any): Promise<void> => {
  const hasPermission = await requestNotificationPermissions();
  if (hasPermission && storeTimes) {
    await scheduleStoreOpeningNotification(storeTimes);
    await scheduleWelcomeNotification();
  }
};

