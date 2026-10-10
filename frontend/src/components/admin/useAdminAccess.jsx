import { useState, useCallback } from 'react';
import axios from 'axios';

/**
 * Shared hook for admin access code verification.
 * Reads/writes `admin_unlocked` in localStorage and verifies
 * the code against POST /admin/secret.
 */
export default function useAdminAccess() {
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:6001';

  const [accessCode, setAccessCode] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(() => {
    return localStorage.getItem('admin_unlocked') === 'true';
  });
  const [secretError, setSecretError] = useState('');
  const [verifying, setVerifying] = useState(false);

  const handleVerifyCode = useCallback(async (e) => {
    e.preventDefault();
    setSecretError('');
    setVerifying(true);

    try {
      const response = await axios.post(`${API_URL}/admin/secret`, { access_code: accessCode });
      if (response.data?.success) {
        setIsUnlocked(true);
        localStorage.setItem('admin_unlocked', 'true');
      } else {
        setSecretError(response.data?.error || 'অবৈধ অ্যাক্সেস কোড!');
      }
    } catch (err) {
      setSecretError(err.response?.data?.error || 'ভুল সিক্রেট কোড! আবার চেষ্টা করুন।');
    } finally {
      setVerifying(false);
    }
  }, [accessCode, API_URL]);

  const handleLock = useCallback(() => {
    localStorage.removeItem('admin_unlocked');
    setIsUnlocked(false);
    setAccessCode('');
  }, []);

  return {
    accessCode,
    setAccessCode,
    isUnlocked,
    secretError,
    verifying,
    handleVerifyCode,
    handleLock,
  };
}
