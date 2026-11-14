'use client';

import { useState, useEffect } from 'react';
import { siteConfig, getWorkspaceUrl } from '@/config/site';

export interface UserSession {
  token: string | null;
  user: {
    email?: string;
    firstName?: string;
    lastName?: string;
    companyName?: string;
  } | null;
  isLoggedIn: boolean;
}

const STORAGE_TOKEN_KEY = 'workivlab_access_token';
const STORAGE_USER_KEY = 'workivlab_user_profile';

// useAuthStatus: detects existing active user session
export function useAuthStatus() {
  const [session, setSession] = useState<UserSession>({
    token: null,
    user: null,
    isLoggedIn: false,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const token = localStorage.getItem(STORAGE_TOKEN_KEY);
      const userRaw = localStorage.getItem(STORAGE_USER_KEY);
      const user = userRaw ? JSON.parse(userRaw) : null;

      if (token) {
        setSession({
          token,
          user,
          isLoggedIn: true,
        });
      }
    } catch {
      // In SSR or storage restricted scenarios
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { ...session, isLoading, workspaceUrl: getWorkspaceUrl('/dashboard') };
}

// saveMarketingSession: stores token and navigates directly to workspace
export function saveMarketingSession(token: string, refreshToken?: string, userProfile?: unknown) {
  try {
    localStorage.setItem(STORAGE_TOKEN_KEY, token);
    if (refreshToken) {
      localStorage.setItem('workivlab_refresh_token', refreshToken);
    }
    if (userProfile) {
      localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(userProfile));
    }
  } catch (err) {
    console.error('Storage error', err);
  }
}
