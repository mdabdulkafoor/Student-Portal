import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../api.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  // Initialize from localStorage or default demo user
  useEffect(() => {
    const savedUser = localStorage.getItem('apex_portal_user');
    const savedProfile = localStorage.getItem('apex_portal_profile');
    const token = localStorage.getItem('apex_portal_token');

    if (savedUser && savedProfile && token) {
      try {
        setUser(JSON.parse(savedUser));
        setProfile(JSON.parse(savedProfile));
      } catch (e) {
        console.error('Error parsing stored session:', e);
        loadDefaultStudent();
      }
    } else {
      // Default to student demo session for immediate rich preview
      loadDefaultStudent();
    }
    setLoading(false);
  }, []);

  const showToast = (message, type = 'success') => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => setToast(null), 4000);
  };

  const loadDefaultStudent = async () => {
    try {
      const res = await api.login('2022CS1042', 'student123');
      if (res.success) {
        setUser(res.user);
        setProfile(res.profile);
        localStorage.setItem('apex_portal_token', res.token);
        localStorage.setItem('apex_portal_user', JSON.stringify(res.user));
        localStorage.setItem('apex_portal_profile', JSON.stringify(res.profile));
      }
    } catch (err) {
      console.warn('Backend loading, setting fallback offline student state:', err);
    }
  };

  const login = async (username, password) => {
    setLoading(true);
    try {
      const res = await api.login(username, password);
      if (res.success) {
        setUser(res.user);
        setProfile(res.profile);
        localStorage.setItem('apex_portal_token', res.token);
        localStorage.setItem('apex_portal_user', JSON.stringify(res.user));
        localStorage.setItem('apex_portal_profile', JSON.stringify(res.profile));
        showToast(`Welcome back, ${res.user.name}! (Signed in as ${res.user.role.toUpperCase()})`);
        return { success: true };
      }
    } catch (err) {
      showToast(err.message || 'Login failed', 'error');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const switchRole = async (targetRole) => {
    setLoading(true);
    try {
      let username = '2022CS1042';
      let password = 'student123';
      if (targetRole === 'faculty') {
        username = 'FAC-CS-101';
        password = 'faculty123';
      } else if (targetRole === 'admin') {
        username = 'admin';
        password = 'admin123';
      }

      const res = await api.login(username, password);
      if (res.success) {
        setUser(res.user);
        setProfile(res.profile);
        localStorage.setItem('apex_portal_token', res.token);
        localStorage.setItem('apex_portal_user', JSON.stringify(res.user));
        localStorage.setItem('apex_portal_profile', JSON.stringify(res.profile));
        showToast(`Switched view to ${targetRole.toUpperCase()}: ${res.user.name}`);
      }
    } catch (err) {
      showToast('Failed to switch role', 'error');
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setProfile(null);
    localStorage.removeItem('apex_portal_token');
    localStorage.removeItem('apex_portal_user');
    localStorage.removeItem('apex_portal_profile');
    showToast('Logged out successfully', 'info');
  };

  const updateProfile = (updatedProfile) => {
    setProfile(updatedProfile);
    localStorage.setItem('apex_portal_profile', JSON.stringify(updatedProfile));
  };

  return (
    <AuthContext.Provider value={{
      user,
      profile,
      role: user?.role || 'student',
      loading,
      login,
      logout,
      switchRole,
      updateProfile,
      toast,
      showToast
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}
