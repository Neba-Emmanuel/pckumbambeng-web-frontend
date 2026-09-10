'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { apiSend } from '@/lib/api-client';

const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || '';
const PUSH_DECLINED_KEY = 'push_declined';

interface NotificationContextType {
  showPushPrompt: boolean;
  acceptPush: () => Promise<void>;
  declinePush: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

/**
 * Anonymous push notifications. Any visitor may opt in to receive browser push
 * notifications for new church content. No account and no per-user records.
 */
export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [showPushPrompt, setShowPushPrompt] = useState(false);

  // Decide whether to show the opt-in prompt (once, for un-subscribed visitors).
  useEffect(() => {
    if (localStorage.getItem(PUSH_DECLINED_KEY) === 'true') return;
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) return;

    navigator.serviceWorker.ready.then((registration) => {
      registration.pushManager.getSubscription().then((subscription) => {
        if (!subscription && Notification.permission !== 'denied') {
          setShowPushPrompt(true);
        }
      });
    });
  }, []);

  const acceptPush = useCallback(async () => {
    if (!VAPID_PUBLIC_KEY || !('serviceWorker' in navigator) || !('PushManager' in window)) {
      setShowPushPrompt(false);
      return;
    }

    try {
      const registration = await navigator.serviceWorker.ready;
      const applicationServerKey = urlBase64ToUint8Array(VAPID_PUBLIC_KEY);
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: applicationServerKey.buffer as ArrayBuffer,
      });

      const subJson = subscription.toJSON();

      await apiSend('/api/notifications/subscribe', 'POST', {
        endpoint: subJson.endpoint,
        p256dh_key: subJson.keys?.p256dh,
        auth_key: subJson.keys?.auth,
      });

      setShowPushPrompt(false);
    } catch {
      // Permission denied or subscription failed
      setShowPushPrompt(false);
    }
  }, []);

  const declinePush = useCallback(() => {
    localStorage.setItem(PUSH_DECLINED_KEY, 'true');
    setShowPushPrompt(false);
  }, []);

  const value: NotificationContextType = {
    showPushPrompt,
    acceptPush,
    declinePush,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}
