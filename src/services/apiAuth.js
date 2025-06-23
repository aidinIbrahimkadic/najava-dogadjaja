// AXIOS veza na API

import axiosInstance from './axiosInstance';

export async function login({ email, password }) {
  const response = await axiosInstance.post(`/auth/login`, {
    email,
    password,
  });
  return response.data;
}

export async function getUserProfile() {
  const response = await axiosInstance.get(`/auth/profile`);

  return response.data;
}

export function logout({ queryClient, navigate }) {
  localStorage.removeItem('eventsToken');
  queryClient.clear();
  navigate('/login');
}
