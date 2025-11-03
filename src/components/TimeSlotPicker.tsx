import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Modal,
} from 'react-native';
import { COLORS, SPACING } from '../utils/constants';
import { generateTimeSlots, formatTimeSlot } from '../utils/timeUtils';
import { isStoreOpen } from '../api/storeApi';
import { SafeAreaView } from 'react-native-safe-area-context';

interface TimeSlotPickerProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (timeSlot: string | null) => void;
  selectedDate: { month: number; day: number } | null;
  selectedTimeSlot: string | null;
  storeTimes: any;
  storeOverrides: any;
}

const TimeSlotPicker: React.FC<TimeSlotPickerProps> = ({
  visible,
  onClose,
  onSelect,
  selectedDate,
  selectedTimeSlot,
  storeTimes,
  storeOverrides,
}) => {
  const [timeSlots] = useState(generateTimeSlots());

  const handleSelect = (timeSlot: string) => {
    if (selectedTimeSlot === timeSlot) {
      onSelect(null);
    } else {
      onSelect(timeSlot);
    }
    onClose();
  };

  const renderTimeSlot = ({ item }: { item: string }) => {
    const isOpen =
      selectedDate && storeTimes
        ? isStoreOpen(storeTimes, storeOverrides, selectedDate.month, selectedDate.day, item)
        : false;
    const isSelected = selectedTimeSlot === item;

    return (
      <TouchableOpacity
        style={[
          styles.timeSlotItem,
          !isOpen && styles.timeSlotClosed,
          isSelected && styles.timeSlotSelected,
        ]}
        onPress={() => handleSelect(item)}
        disabled={!isOpen}
      >
        <View style={styles.timeSlotContent}>
          <Text
            style={[
              styles.timeSlotText,
              !isOpen && styles.timeSlotTextClosed,
              isSelected && styles.timeSlotTextSelected,
            ]}
          >
            {formatTimeSlot(item)}
          </Text>
          <View
            style={[
              styles.statusDot,
              isOpen ? styles.statusDotOpen : styles.statusDotClosed,
            ]}
          />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <SafeAreaView style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Select Time Slot</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={timeSlots}
            renderItem={renderTimeSlot}
            keyExtractor={(item) => item}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        </SafeAreaView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderGray,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.black,
  },
  closeButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 24,
    color: COLORS.gray,
  },
  listContent: {
    padding: SPACING.md,
  },
  timeSlotItem: {
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.sm,
    borderRadius: 8,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.borderGray,
  },
  timeSlotClosed: {
    opacity: 0.5,
    backgroundColor: COLORS.lightGray,
  },
  timeSlotSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  timeSlotContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timeSlotText: {
    fontSize: 16,
    color: COLORS.black,
    fontWeight: '500',
  },
  timeSlotTextClosed: {
    color: COLORS.gray,
  },
  timeSlotTextSelected: {
    color: COLORS.white,
    fontWeight: '700',
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  statusDotOpen: {
    backgroundColor: '#4CAF50',
  },
  statusDotClosed: {
    backgroundColor: COLORS.error,
  },
});

export default TimeSlotPicker;

