
export const COLORS = {
  primary: '#2176FF',
  black: '#000000',
  white: '#FFFFFF',
  gray: '#666666',
  lightGray: '#E7E7E7',
  borderGray: '#E0E0E0',
  error: '#FF0000',
  darkGray: '#333333',
} as const;

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
} as const;

export const CUSTOM_KEYS = {
  firebase: "firebase",
  Home: "Home",
  SignIn: "SignIn",
  large: "large",
  padding: "padding",
  height: "height",
  ios: "ios",
  handled: "handled",
  Email: "Email",
  none: "none",
  emailaddress: "email-address",
  Password: "Password",
  primary: "primary",
  secondary: "secondary",
} as const;

export const CUSTOM_MESSAGES = {
  SIGN_IN_FAILED: 'Failed to sign in',
  ERROR_OCCURRED: 'An unexpected error occurred',
  GOOGLE_SIGN_IN_FAILED: 'Failed to sign in with Google',
  EMAIl_PLACEHOLDER: "Enter email address",
  PASSWORD_PLACEHOLDER: "At least 8 characters",
  SIGN_IN: 'Sign in',
  FORGOT_PASSWORD: 'Forgot password?',
  SIGN_IN_WITH_GOOGLE: 'Sign in with Google',
  DONT_HAVE_ACCOUNT: "Don't have an account? ",
  CREATE_ACCOUNT: 'Create an account',
  ENTER_VALID_EMAIL: 'Please enter a valid email address',
  ENTER_VALID_PASSWORD: 'Password must be at least 7 characters',
} as const;