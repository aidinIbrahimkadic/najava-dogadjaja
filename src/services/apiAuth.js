// src/services/apiAuth.js
import axios from 'axios';

const API_URL = 'https://events-opcina.poruci.ba/api';

export async function loginUser({ email, password }) {
  const response = await axios.post(`${API_URL}/auth/login`, {
    email,
    password,
  });

  return response.data;
}
