import { useEffect, useRef } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SignInScreen from '../screens/SignInScreen';
import HomeScreen from '../screens/HomeScreen';
import { useAuth } from '../context/AuthContext';
import { COLORS, CUSTOM_KEYS } from '../utils/constants';

export type RootStackParamList = {
  SignIn: undefined;
  Home: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const navigationRef = useRef<any>(null);
  const prevIsAuthenticatedRef = useRef<boolean | undefined>(undefined);

  useEffect(() => {
    if (isLoading) {
      return;
    }

    if (prevIsAuthenticatedRef.current !== undefined && prevIsAuthenticatedRef.current !== isAuthenticated) {
      if (navigationRef.current) {
        if (isAuthenticated) {
          navigationRef.current.reset({
            index: 0,
            routes: [{ name: CUSTOM_KEYS.Home }],
          });
        } else {
          navigationRef.current.reset({
            index: 0,
            routes: [{ name: CUSTOM_KEYS.SignIn }],
          });
        }
      }
    }

    prevIsAuthenticatedRef.current = isAuthenticated;
  }, [isAuthenticated, isLoading]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size={CUSTOM_KEYS.large} color={COLORS.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator
        initialRouteName={isAuthenticated ? CUSTOM_KEYS.Home : CUSTOM_KEYS.SignIn}
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name={CUSTOM_KEYS.SignIn} component={SignInScreen} />
        <Stack.Screen name={CUSTOM_KEYS.Home} component={HomeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.white,
  },
});

export default AppNavigator;

