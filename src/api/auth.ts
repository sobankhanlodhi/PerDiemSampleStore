
import { getAuth, getIdToken, GoogleAuthProvider, signInWithCredential, signOut } from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import Config from 'react-native-config';
import { StorageHelper } from '../utils/storage';
import { base64Encode } from '../utils/base64';

const API_BASE_URL = 'https://coding-challenge-pd-1a25b1a14f34.herokuapp.com';
const BASIC_AUTH_USERNAME = 'perdiem';
const BASIC_AUTH_PASSWORD = 'perdiem';


const getBasicAuthHeader = (): string => {
  const credentials = `${BASIC_AUTH_USERNAME}:${BASIC_AUTH_PASSWORD}`;
  return `Basic ${base64Encode(credentials)}`;
};


export const signInWithEmail = async (email: string, password: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: getBasicAuthHeader(),
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        error: errorData.message || `Login failed: ${response.statusText}`,
      };
    }

    const data = await response.json();
    const token = data.token;

    if (!token) {
      return {
        success: false,
        error: 'No token received from server',
      };
    }

    const verifyResponse = await verifyToken(token);
    
    if (!verifyResponse.success || !verifyResponse.user) {
      return {
        success: false,
        error: 'Failed to verify token and fetch user information',
      };
    }

    StorageHelper.setToken(token);
    StorageHelper.setUserInfo(verifyResponse.user);
    StorageHelper.setAuthSource('api');

    return {
      success: true,
      token,
      user: verifyResponse.user,
    };
  } catch (error: any) {
      console.log('error: ', error);
    
    return {
      success: false,
      error: error.message || 'Failed to sign in. Please check your connection and try again.',
    };
  }
};


export const signInWithGoogle = async () => {
  try {
    GoogleSignin.configure({
      webClientId: Config.WEB_CLIENT_ID,
      offlineAccess: true,
    });

    await GoogleSignin.hasPlayServices();

    const userInfo = await GoogleSignin.signIn();

    const { idToken } = await GoogleSignin.getTokens();

    const googleCredential = GoogleAuthProvider.credential(idToken);

    const authInstance = getAuth();
    const userCredential = await signInWithCredential(authInstance, googleCredential);;
    const firebaseUser = userCredential.user;

    const token = await getIdToken(firebaseUser);
   
    const userData = {
      email: firebaseUser.email || '',
      name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || '',
    };
    
    StorageHelper.setToken(token);
    StorageHelper.setUserInfo(userData);
    StorageHelper.setAuthSource('firebase'); 

    return {
      success: true,
      token,
      user: userData,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to sign in with Google. Please try again.',
    };
  }
};


export const verifyToken = async (token: string): Promise<{ success: boolean; user?: any }> => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/verify`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      return { success: false };
    }

    const userData = await response.json();
    
    return {
      success: true,
      user: {
        email: userData.email || '',
        name: userData.name || userData.email?.split('@')[0] || '',
        userId: userData.userId,
        role: userData.role,
      },
    };
  } catch (error) {
    return { success: false };
  }
};

export const firebaseApiLogout = async () => {
  try {
    const authInstance = getAuth();
    const currentUser = authInstance.currentUser;
    if (currentUser) {
      await signOut(authInstance);
    }

    try {
      await GoogleSignin.signOut();
    } catch (error) {
    }

    StorageHelper.clearAuth();

    return { success: true };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to logout',
    };
  }
};
