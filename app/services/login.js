// services/login.js
import api from '@/lib/api';

export const login = async (email, password) => {
  const res = await api.post('/auth/login', { email, password });
  return res.data;
};
