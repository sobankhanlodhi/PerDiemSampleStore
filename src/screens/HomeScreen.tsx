import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ScrollView,
  Switch,
  ActivityIndicator,
  Modal,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';
import { StorageHelper } from '../utils/storage';
import { getGreeting, generateDateList, getLocalCityName } from '../utils/timeUtils';
import { fetchStoreTimes, fetchStoreOverrides, isStoreOpen } from '../api/storeApi';
import { COLORS, SPACING } from '../utils/constants';
import OfflineBanner from '../components/OfflineBanner';
import TimeSlotPicker from '../components/TimeSlotPicker';
import { useNetworkStatus } from '../hooks/useNetworkStatus';
import { initializeNotifications, cancelAllNotifications } from '../utils/notifications';

interface SelectedSlot {
  date: { month: number; day: number };
  timeSlot: string;
}

const HomeScreen: React.FC = () => {
  const { user, logout } = useAuth();
  const { isConnected } = useNetworkStatus();
  
  const [timezonePreference, setTimezonePreference] = useState<'nyc' | 'local'>('nyc');
  const [greeting, setGreeting] = useState('');
  const [dates] = useState(generateDateList(30));
  const [selectedSlot, setSelectedSlot] = useState<SelectedSlot | null>(null);
  const [storeTimes, setStoreTimes] = useState<any>(null);
  const [storeOverrides, setStoreOverrides] = useState<any>({});
  const [timeSlotPickerVisible, setTimeSlotPickerVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState<{ month: number; day: number } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    const preference = StorageHelper.getTimezonePreference();
    setTimezonePreference(preference);
  }, []);

  useEffect(() => {
    const savedSlot = StorageHelper.getSelectedTimeSlot();
    if (savedSlot) {
      setSelectedSlot(savedSlot);
    }
  }, []);
  
  useEffect(() => {
    const updateGreeting = () => {
      setGreeting(getGreeting(timezonePreference));
    };
    
    updateGreeting();
    const interval = setInterval(updateGreeting, 60000); 
    
    return () => clearInterval(interval);
  }, [timezonePreference]);

  useEffect(() => {
    loadStoreData();
  }, []);

  useEffect(() => {
    if (storeTimes) {
      initializeNotifications(storeTimes);
    }
  }, [storeTimes]);

  const loadStoreData = async () => {
    setIsLoading(true);
    try {
      const timesResult = await fetchStoreTimes(!isConnected);
      if (timesResult.success && timesResult.data) {
        setStoreTimes(timesResult.data);
      }

      const overrideResult = await fetchStoreOverrides(!isConnected);
      if (overrideResult.success && overrideResult.data) {
        setStoreOverrides(overrideResult.data);
      }
    } catch (error) {
      console.error('Error loading store data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTimezoneToggle = (value: boolean) => {
    const preference = value ? 'local' : 'nyc';
    setTimezonePreference(preference);
    StorageHelper.setTimezonePreference(preference);
  };

  const handleDatePress = (date: { month: number; day: number }) => {
    setSelectedDate(date);
    setTimeSlotPickerVisible(true);
  };

  const handleTimeSlotSelect = (timeSlot: string | null) => {
    if (selectedDate) {
      if (timeSlot === null) {
        setSelectedSlot(null);
        StorageHelper.setSelectedTimeSlot(null);
      } else {
        const newSlot = {
          date: selectedDate,
          timeSlot,
        };
        setSelectedSlot(newSlot);
        StorageHelper.setSelectedTimeSlot(newSlot);
      }
    }
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await cancelAllNotifications();
      await logout();
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  const getDateStatus = (date: { month: number; day: number }): { open: boolean; hasOverride: boolean } => {
    if (!storeTimes) {
      return { open: false, hasOverride: false };
    }

    const overrides = storeOverrides[`${date.month}-${date.day}`];
    const hasOverride = !!(overrides && Array.isArray(overrides) && overrides.length > 0);

    const dateObj = new Date();
    dateObj.setMonth(date.month - 1);
    dateObj.setDate(date.day);
    const dayOfWeek = dateObj.getDay();

    const daySchedules = storeTimes.filter((s: any) => s.day_of_week === dayOfWeek);
    
    if (hasOverride) {
      const hasOpenOverride = overrides.some((o: any) => o.is_open === true);
      return { open: hasOpenOverride, hasOverride: true };
    }

    const hasOpenSchedule = daySchedules.some((s: any) => s.is_open === true);
    return { open: hasOpenSchedule, hasOverride: false };
  };

  const renderDateItem = ({ item }: { item: { date: Date; month: number; day: number } }) => {
    const status = getDateStatus(item);
    const isSelected = selectedSlot?.date.month === item.month && selectedSlot?.date.day === item.day;

    return (
      <TouchableOpacity
        style={[styles.dateItem, isSelected && styles.dateItemSelected]}
        onPress={() => handleDatePress(item)}
      >
        <Text style={[styles.dateText, isSelected && styles.dateTextSelected]}>
          {formatDate(item.date)}
        </Text>
        <View
          style={[
            styles.statusIndicator,
            status.open ? styles.statusIndicatorOpen : styles.statusIndicatorClosed,
          ]}
        />
        {status.hasOverride && (
          <Text style={styles.overrideBadge}>Override</Text>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {!isConnected && <OfflineBanner />}
      
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>{greeting}</Text>
            <Text style={styles.userName}>{user?.name || user?.email}</Text>
          </View>
          <TouchableOpacity 
            onPress={handleLogout} 
            style={[styles.logoutButton, isLoggingOut && styles.logoutButtonDisabled]}
            disabled={isLoggingOut}
          >
            <Image source={require('../../assets/images/logout_icon.png')} style={{ width: 20, height: 20 }} />
          </TouchableOpacity>
        </View>

        <View style={styles.timezoneSection}>
          <Text style={styles.timezoneLabel}>NYC</Text>
          <Switch
            value={timezonePreference === 'local'}
            onValueChange={handleTimezoneToggle}
            trackColor={{ false: COLORS.lightGray, true: COLORS.primary }}
            thumbColor={COLORS.white}
          />
          <Text style={styles.timezoneLabel}>{getLocalCityName()}</Text>
        </View>

        {selectedSlot && (
          <View style={styles.selectedSlotContainer}>
            <Text style={styles.selectedSlotTitle}>Selected Time Slot</Text>
            <Text style={styles.selectedSlotText}>
              {formatDate(
                new Date(
                  new Date().getFullYear(),
                  selectedSlot.date.month - 1,
                  selectedSlot.date.day
                )
              )}{' '}
              at {selectedSlot.timeSlot}
            </Text>
          </View>
        )}

        <Text style={styles.sectionTitle}>Select a Date</Text>
        <FlatList
          data={dates}
          renderItem={renderDateItem}
          keyExtractor={(item) => `${item.month}-${item.day}`}
          scrollEnabled={false}
          contentContainerStyle={styles.dateList}
        />
      </ScrollView>

      <TimeSlotPicker
        visible={timeSlotPickerVisible}
        onClose={() => {
          setTimeSlotPickerVisible(false);
          setSelectedDate(null);
        }}
        onSelect={handleTimeSlotSelect}
        selectedDate={selectedDate}
        selectedTimeSlot={
          selectedDate &&
          selectedSlot &&
          selectedSlot.date.month === selectedDate.month &&
          selectedSlot.date.day === selectedDate.day
            ? selectedSlot.timeSlot
            : null
        }
        storeTimes={storeTimes}
        storeOverrides={selectedDate ? storeOverrides[`${selectedDate.month}-${selectedDate.day}`] : null}
      />

      <Modal
        visible={isLoggingOut}
        transparent={true}
        animationType="fade"
      >
        <View style={styles.loadingOverlay}>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Text style={styles.loadingText}>Logging out...</Text>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: SPACING.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.xl,
  },
  greeting: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.black,
    marginBottom: SPACING.xs,
  },
  userName: {
    fontSize: 16,
    color: COLORS.gray,
  },
  logoutButton: {
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: 8,
    backgroundColor: COLORS.lightGray,
  },
  logoutButtonDisabled: {
    opacity: 0.6,
  },
  logoutText: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  timezoneSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.xl,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.lightGray,
    borderRadius: 12,
  },
  timezoneLabel: {
    fontSize: 14,
    color: COLORS.black,
    marginHorizontal: SPACING.md,
    fontWeight: '500',
  },
  selectedSlotContainer: {
    backgroundColor: COLORS.primary,
    padding: SPACING.md,
    borderRadius: 12,
    marginBottom: SPACING.xl,
  },
  selectedSlotTitle: {
    fontSize: 12,
    color: COLORS.white,
    opacity: 0.9,
    marginBottom: SPACING.xs,
  },
  selectedSlotText: {
    fontSize: 18,
    color: COLORS.white,
    fontWeight: '700',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.black,
    marginBottom: SPACING.md,
  },
  dateList: {
    paddingBottom: SPACING.xl,
  },
  dateItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.sm,
    borderRadius: 8,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.borderGray,
  },
  dateItemSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  dateText: {
    flex: 1,
    fontSize: 16,
    color: COLORS.black,
    fontWeight: '500',
  },
  dateTextSelected: {
    color: COLORS.white,
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: SPACING.sm,
  },
  statusIndicatorOpen: {
    backgroundColor: '#4CAF50',
  },
  statusIndicatorClosed: {
    backgroundColor: COLORS.error,
  },
  overrideBadge: {
    fontSize: 10,
    color: COLORS.gray,
    backgroundColor: COLORS.lightGray,
    paddingHorizontal: SPACING.xs,
    paddingVertical: 2,
    borderRadius: 4,
  },
  loadingOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    backgroundColor: COLORS.white,
    padding: SPACING.xl,
    borderRadius: 12,
    alignItems: 'center',
    minWidth: 150,
  },
  loadingText: {
    marginTop: SPACING.md,
    fontSize: 16,
    color: COLORS.black,
    fontWeight: '500',
  },
});

export default HomeScreen;
