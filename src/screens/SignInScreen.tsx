
import { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Logo from '../components/Logo';
import CustomTextInput from '../components/CustomTextInput';
import Button from '../components/Button';
import Separator from '../components/Separator';
import GoogleLogo from '../components/GoogleIcon';
import { isValidEmail, isValidPassword } from '../utils/validation';
import { signInWithEmail, signInWithGoogle } from '../api/auth';
import { useAuth } from '../context/AuthContext';
import { COLORS, CUSTOM_KEYS, CUSTOM_MESSAGES, SPACING } from '../utils/constants';

const SignInScreen: React.FC = () => {
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const buttonOpacity = useRef(new Animated.Value(1)).current;

  const validateEmail = (value: string): boolean => {
    if (!value.trim()) {
      setEmailError('');
      return false;
    }
    if (!isValidEmail(value)) {
      setEmailError(CUSTOM_MESSAGES.ENTER_VALID_EMAIL);
      return false;
    }
    setEmailError('');
    return true;
  };

  const validatePassword = (value: string): boolean => {
    if (!value.trim()) {
      setPasswordError('');
      return false;
    }
    if (!isValidPassword(value, 7)) {
      setPasswordError(CUSTOM_MESSAGES.ENTER_VALID_PASSWORD);
      return false;
    }
    setPasswordError('');
    return true;
  };

  const isFormValid = (): boolean => {
    const emailValid = isValidEmail(email);
    const passwordValid = isValidPassword(password, 7);
    return emailValid && passwordValid;
  };

  const handleEmailChange = (value: string) => {
    setEmail(value);
    setErrorMessage('');
    validateEmail(value);
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    setErrorMessage('');
    validatePassword(value);
  };

  const handleSignIn = async () => {
    if (!isFormValid()) {
      validateEmail(email);
      validatePassword(password);
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    try {
      const result = await signInWithEmail(email, password);
      if (result.success && result.token && result.user) {
        login(result.token, result.user);
      } else {
        setErrorMessage(result.error || CUSTOM_MESSAGES.SIGN_IN_FAILED);
      }
    } catch (error: any) {
      setErrorMessage(error.message || CUSTOM_MESSAGES.ERROR_OCCURRED);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    setErrorMessage('');

    try {
      const result = await signInWithGoogle();
      if (result.success && result.token && result.user) {
        login(result.token, result.user);
      } else {
        setErrorMessage(result.error || CUSTOM_MESSAGES.GOOGLE_SIGN_IN_FAILED);
      }
    } catch (error: any) {
      setErrorMessage(error.message || CUSTOM_MESSAGES.ERROR_OCCURRED);
    } finally {
      setIsGoogleLoading(false);
    }
  };

  useEffect(() => {
    Animated.timing(buttonOpacity, {
      toValue: isLoading || isGoogleLoading ? 0.5 : 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [isLoading, isGoogleLoading, buttonOpacity]);

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === CUSTOM_KEYS.ios ? CUSTOM_KEYS.padding : CUSTOM_KEYS.height}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps={CUSTOM_KEYS.handled}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            <Logo />
            <Text style={styles.title}>{CUSTOM_MESSAGES.SIGN_IN}</Text>

            <View style={styles.form}>
              <CustomTextInput
                label={CUSTOM_KEYS.Email}
                placeholder={CUSTOM_MESSAGES.EMAIl_PLACEHOLDER}
                value={email}
                onChangeText={handleEmailChange}
                keyboardType={CUSTOM_KEYS.emailaddress}
                autoCapitalize={CUSTOM_KEYS.none}
                autoCorrect={false}
                editable={!isLoading && !isGoogleLoading}
                error={emailError}
              />

              <CustomTextInput
                label={CUSTOM_KEYS.Password}
                placeholder={CUSTOM_MESSAGES.PASSWORD_PLACEHOLDER}
                value={password}
                onChangeText={handlePasswordChange}
                showPasswordToggle
                isPasswordVisible={isPasswordVisible}
                onTogglePassword={() => setIsPasswordVisible(!isPasswordVisible)}
                editable={!isLoading && !isGoogleLoading}
                error={passwordError}
              />

              <Text style={styles.forgotPassword}>{CUSTOM_MESSAGES.FORGOT_PASSWORD}</Text>

              {errorMessage ? (
                <Text style={styles.errorMessage}>{errorMessage}</Text>
              ) : null}

              <Animated.View style={{ opacity: buttonOpacity }}>
                <Button
                  title={CUSTOM_MESSAGES.SIGN_IN}
                  onPress={handleSignIn}
                  variant={CUSTOM_KEYS.primary}
                  disabled={!isFormValid()}
                  loading={isLoading}
                />
              </Animated.View>

              <Separator />

              <Animated.View style={{ opacity: buttonOpacity }}>
                <Button
                  title={CUSTOM_MESSAGES.SIGN_IN_WITH_GOOGLE}
                  onPress={handleGoogleSignIn}
                  variant={CUSTOM_KEYS.secondary}
                  disabled={false}
                  loading={isGoogleLoading}
                  icon={<GoogleLogo />}
                />
              </Animated.View>
            </View>

            <View style={styles.signUpContainer}>
              <Text style={styles.signUpText}>
                {CUSTOM_MESSAGES.DONT_HAVE_ACCOUNT}
                <Text style={styles.signUpLink}>{CUSTOM_MESSAGES.CREATE_ACCOUNT}</Text>
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.xl,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.black,
    textAlign: 'center',
    marginBottom: SPACING.xl,
  },
  form: {
    width: '100%',
    marginBottom: SPACING.lg,
  },
  forgotPassword: {
    fontSize: 14,
    color: COLORS.primary,
    textAlign: 'left',
    marginTop: SPACING.sm,
    marginBottom: SPACING.md,
    fontWeight: '400',
  },
  errorMessage: {
    fontSize: 14,
    color: COLORS.error,
    marginBottom: SPACING.md,
    textAlign: 'center',
  },
  signUpContainer: {
    marginTop: SPACING.xl,
    alignItems: 'center',
  },
  signUpText: {
    fontSize: 14,
    color: COLORS.black,
    textAlign: 'center',
  },
  signUpLink: {
    color: COLORS.primary,
    fontWeight: '500',
  },
});

export default SignInScreen;

