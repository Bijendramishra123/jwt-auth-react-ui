import api from './api';
import { tokenService } from './tokenService';

const authService = {
  async register(userData) {
    try {
      console.log('Registering user:', userData);
      const response = await api.post('/api/users/register', userData);
      return response.data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error.response?.data?.message || error.message || 'Registration failed';
    }
  },

  async login(credentials) {
    try {
      console.log('Logging in:', credentials.email);
      const response = await api.post('/api/users/login', credentials);
      const { token, ...userData } = response.data;
      
      if (token) {
        tokenService.setToken(token);
        tokenService.setUser(userData);
      }
      
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error.response?.data?.message || error.message || 'Login failed';
    }
  },

  async getProfile() {
    try {
      const response = await api.get('/api/users/profile');
      return response.data;
    } catch (error) {
      console.error('Get profile error:', error);
      throw error;
    }
  },

  async forgotPassword(email) {
    try {
      const response = await api.post('/api/users/forgot-password', { email });
      return response.data;
    } catch (error) {
      console.error('Forgot password error:', error);
      throw error.response?.data?.message || error.message || 'Failed to send reset email';
    }
  },

  async resetPassword(token, newPassword) {
    try {
      const response = await api.post('/api/users/reset-password', { 
        token, 
        newPassword 
      });
      return response.data;
    } catch (error) {
      console.error('Reset password error:', error);
      throw error.response?.data?.message || error.message || 'Failed to reset password';
    }
  },

  logout() {
    tokenService.clearStorage();
  },

  isAuthenticated() {
    return !!tokenService.getToken();
  },

  getCurrentUser() {
    return tokenService.getUser();
  }
};

// Default export
export default authService;
