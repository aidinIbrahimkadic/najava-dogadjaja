//AXIOS INSTANCA

import axios from 'axios';

const API_URL = 'https://events-opcina.poruci.ba/api';

const axiosInstance = axios.create({
  baseURL: API_URL,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('eventsToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Auto-refresh token on 401
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      localStorage.getItem('eventsRefreshToken')
    ) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem('eventsRefreshToken');
        const response = await axios.post(
          'https://events-opcina.poruci.ba/api/auth/refresh-token',
          {
            refreshToken,
          }
        );

        const newToken = response.data.token;
        localStorage.setItem('eventsToken', newToken);
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
        originalRequest.headers['Authorization'] = `Bearer ${newToken}`;

        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // Refresh token failed → force logout
        localStorage.removeItem('eventsToken');
        localStorage.removeItem('eventsRefreshToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
