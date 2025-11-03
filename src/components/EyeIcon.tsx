import { Text, StyleSheet } from 'react-native';

interface EyeIconProps {
  visible: boolean;
}

const EyeIcon: React.FC<EyeIconProps> = ({ visible }) => {
  return (
    <Text style={styles.icon}>
      {visible ? '🫣' : '🙈'}
    </Text>
  );
};

const styles = StyleSheet.create({
  icon: {
    fontSize: 18,
  },
});

export default EyeIcon;

