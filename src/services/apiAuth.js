// AXIOS veza na API

import axiosInstance from './axiosInstance';

export async function login({ email, password }) {
  try {
    const response = await axiosInstance.post(`/auth/login`, {
      email,
      password,
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Greška pri prijavi');
  }
}

export async function register({ username, first_name, last_name, email, password }) {
  try {
    const response = await axiosInstance.post(`/auth/register`, {
      username,
      first_name,
      last_name,
      email,
      password,
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Greška pri registraciji');
  }
}

export async function getUserProfile() {
  try {
    const response = await axiosInstance.get(`/auth/profile`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Greška pri dobavljanju profila korisnika');
  }
}

export async function getUserPermissions() {
  try {
    const response = await axiosInstance.get(`/auth/user-permissions`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Greška pri dobavljanju dozvola korisnika');
  }
}

export async function postChangePassword({
  data: { current_password, new_password, new_password_confirmation },
}) {
  try {
    const response = await axiosInstance.post(`/auth/change-password`, {
      current_password,
      new_password,
      new_password_confirmation,
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Greška pri promjeni lozinke');
  }
}
