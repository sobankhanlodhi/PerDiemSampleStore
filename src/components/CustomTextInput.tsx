import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  TextInputProps,
} from 'react-native';
import { COLORS, SPACING } from '../utils/constants';
import EyeIcon from './EyeIcon';

interface CustomTextInputProps extends TextInputProps {
  label: string;
  showPasswordToggle?: boolean;
  isPasswordVisible?: boolean;
  onTogglePassword?: () => void;
  error?: string;
}

const CustomTextInput: React.FC<CustomTextInputProps> = ({
  label,
  showPasswordToggle = false,
  isPasswordVisible = false,
  onTogglePassword,
  error,
  style,
  ...textInputProps
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.inputContainer, error && styles.inputContainerError]}>
        <TextInput
          style={[styles.input, showPasswordToggle && styles.inputWithIcon]}
          placeholderTextColor={COLORS.gray}
          secureTextEntry={showPasswordToggle && !isPasswordVisible}
          {...textInputProps}
        />
        {showPasswordToggle && (
          <TouchableOpacity
            onPress={onTogglePassword}
            style={styles.eyeIcon}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <EyeIcon visible={isPasswordVisible} />
          </TouchableOpacity>
        )}
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.md,
    width: '100%',
  },
  label: {
    fontSize: 14,
    color: COLORS.gray,
    marginBottom: SPACING.sm,
    fontWeight: '400',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.borderGray,
    borderRadius: 8,
    backgroundColor: COLORS.white,
    paddingHorizontal: SPACING.md,
    height: 50,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  inputContainerError: {
    borderColor: COLORS.error,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: COLORS.black,
    paddingVertical: 0,
  },
  inputWithIcon: {
    paddingRight: SPACING.sm,
  },
  eyeIcon: {
    padding: SPACING.xs,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: COLORS.error,
    fontSize: 12,
    marginTop: SPACING.xs,
  },
});

export default CustomTextInput;

