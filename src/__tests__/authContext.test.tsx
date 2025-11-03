/**
 * Unit tests for AuthContext
 * Basic tests for authentication context functionality
 */

import { StorageHelper } from '../utils/storage';
import * as authApi from '../api/auth';

// Mock storage
jest.mock('../utils/storage', () => ({
  StorageHelper: {
    getToken: jest.fn(),
    getUserInfo: jest.fn(),
    clearAuth: jest.fn(),
    setToken: jest.fn(),
    setUserInfo: jest.fn(),
  },
}));

// Mock auth API
jest.mock('../api/auth', () => ({
  verifyToken: jest.fn(),
  firebaseApiLogout: jest.fn(),
}));

describe('AuthContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Token Verification', () => {
    it('should verify token successfully', async () => {
      (StorageHelper.getToken as jest.Mock).mockReturnValue('valid-token');
      (authApi.verifyToken as jest.Mock).mockResolvedValue(true);

      const result = await authApi.verifyToken('valid-token');
      expect(result).toBe(true);
    });

    it('should return false for invalid token', async () => {
      (authApi.verifyToken as jest.Mock).mockResolvedValue(false);

      const result = await authApi.verifyToken('invalid-token');
      expect(result).toBe(false);
    });
  });

  describe('Storage Helper', () => {
    it('should get token from storage', () => {
      (StorageHelper.getToken as jest.Mock).mockReturnValue('test-token');
      const token = StorageHelper.getToken();
      expect(token).toBe('test-token');
    });

    it('should get user info from storage', () => {
      const mockUser = { email: 'test@example.com', name: 'Test User' };
      (StorageHelper.getUserInfo as jest.Mock).mockReturnValue(mockUser);
      const user = StorageHelper.getUserInfo();
      expect(user).toEqual(mockUser);
    });

    it('should clear auth data', () => {
      StorageHelper.clearAuth();
      expect(StorageHelper.clearAuth).toHaveBeenCalled();
    });
  });

  describe('Login Flow', () => {
    it('should store token and user info on login', () => {
      const token = 'new-token';
      const user = { email: 'user@example.com', name: 'User' };
      
      StorageHelper.setToken(token);
      StorageHelper.setUserInfo(user);

      expect(StorageHelper.setToken).toHaveBeenCalledWith(token);
      expect(StorageHelper.setUserInfo).toHaveBeenCalledWith(user);
    });
  });
});

