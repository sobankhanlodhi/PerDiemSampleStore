import { View, Text, StyleSheet } from 'react-native';
import { COLORS, SPACING } from '../utils/constants';

const OfflineBanner: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>No internet connection. Using cached data.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.error,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    alignItems: 'center',
  },
  text: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '500',
  },
});

export default OfflineBanner;

