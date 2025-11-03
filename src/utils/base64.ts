/**
 * Base64 encoding utility for React Native
 * Provides btoa-like functionality
 */

export const base64Encode = (str: string): string => {
  // For React Native, we can use a simple base64 encoding
  // Using the fact that React Native's global has atob/btoa on some platforms
  // Otherwise, we use a polyfill
  if (typeof btoa !== 'undefined') {
    return btoa(str);
  }
  
  // Simple base64 encoding for React Native
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
  let output = '';
  
  for (let i = 0; i < str.length; i += 3) {
    const a = str.charCodeAt(i);
    const b = str.charCodeAt(i + 1);
    const c = str.charCodeAt(i + 2);
    
    const bitmap = (a << 16) | ((b || 0) << 8) | (c || 0);
    
    output += chars.charAt((bitmap >> 18) & 63);
    output += chars.charAt((bitmap >> 12) & 63);
    output += (i + 1 < str.length) ? chars.charAt((bitmap >> 6) & 63) : '=';
    output += (i + 2 < str.length) ? chars.charAt(bitmap & 63) : '=';
  }
  
  return output;
};

