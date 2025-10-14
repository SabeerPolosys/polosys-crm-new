
import api from '@/lib/axios';

export const logout = async () => {
  try {
    await api.post('/api/v1/auth/logout');
  } catch (error) {
    //
  }
  window.location.href = '/login';
};
