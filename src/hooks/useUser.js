import { useState, useCallback } from 'react';

const STORAGE_KEY = 'bengzhu-uid';

function generateRandomUid() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let result = '';
  for (let i = 0; i < 4; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return `玩家_${result}`;
}

function getStoredUid() {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

export function useUser() {
  const [uid, setUidState] = useState(() => getStoredUid());

  const setUid = useCallback((name) => {
    const trimmed = name.trim().slice(0, 12) || generateRandomUid();
    try {
      localStorage.setItem(STORAGE_KEY, trimmed);
    } catch { /* localStorage 不可用 */ }
    setUidState(trimmed);
  }, []);

  const randomUid = useCallback(() => {
    const name = generateRandomUid();
    setUid(name);
    return name;
  }, [setUid]);

  return {
    uid,
    setUid,
    randomUid,
    hasUid: uid !== null,
  };
}
