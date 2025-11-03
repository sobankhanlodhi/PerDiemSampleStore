import { View, Text, StyleSheet } from 'react-native';
import { COLORS, SPACING } from '../utils/constants';

const Separator: React.FC = () => {
  return (
    <View style={styles.container}>
      <View style={styles.line} />
      <Text style={styles.text}>or</Text>
      <View style={styles.line} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: SPACING.md,
    width: '100%',
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.borderGray,
  },
  text: {
    marginHorizontal: SPACING.md,
    fontSize: 14,
    color: COLORS.black,
    fontWeight: '400',
  },
});

export default Separator;

