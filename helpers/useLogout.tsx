"use client"
import api from '@/lib/axios';
import { useRouter } from 'next/navigation';

export const useLogout = () => {
  const router = useRouter();

  const logout = async () => {
    try {
      await api.post('/api/v1/auth/logout');
    } catch (error) {
    //   console.error('Logout failed', error);
    }
    router.push('/login');
  };

  return logout;
};
