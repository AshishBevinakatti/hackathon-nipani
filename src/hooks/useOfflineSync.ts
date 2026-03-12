import { useState, useEffect } from 'react';

export function useOfflineSync<T>(key: string, initialData: T[]) {
  const [data, setData] = useState<T[]>(() => {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : initialData;
  });

  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(data));
  }, [data, key]);

  const addItem = (item: T) => {
    setData((prev) => [...prev, item]);
    // In a real app, we'd queue this for background sync if offline
  };

  return { data, addItem, isOnline };
}
