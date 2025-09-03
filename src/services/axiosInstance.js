//AXIOS INSTANCA

// Ovaj kod kreira instancu axios-a koja automatski upravlja JWT tokenima, uključujući proaktivno osvježavanje tokena 5 sekundi prije isteka, kao i reaktivno osvježavanje tokena kada dođe do greške 401 ili 403. Također, čisti lokalnu pohranu i preusmjerava korisnika na login stranicu kada token istekne.

import axios from 'axios';
import { URL } from '../utils/constants';
import { redirectToLogin } from '../utils/redirectService';

const API_URL = `${URL}/api`;

const axiosInstance = axios.create({
  baseURL: API_URL,
});

let isRefreshing = false;
let failedQueue = [];

// Funkcija za dekodiranje JWT tokena (bez validacije)
const decodeToken = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.log(error);
    return null;
  }
};

// Funkcija za provjeru da li token uskoro ističe (5 sekundi prije)
const isTokenNearExpiry = (token) => {
  if (!token) return true;

  const decoded = decodeToken(token);
  if (!decoded || !decoded.exp) return true;

  const currentTime = Math.floor(Date.now() / 1000);
  const expirationTime = decoded.exp;
  const fiveSecondsInSeconds = 5;

  return expirationTime - currentTime <= fiveSecondsInSeconds;
};

// Funkcija za proaktivni refresh tokena
const proactiveTokenRefresh = async () => {
  const token = localStorage.getItem('eventsToken');
  const refreshToken = localStorage.getItem('refreshToken');

  if (!refreshToken) return false;

  if (isTokenNearExpiry(token)) {
    // console.log('Token uskoro ističe (5 sekundi), pokrećem proaktivni refresh...');

    if (isRefreshing) return true; // Već se osvježava

    isRefreshing = true;

    try {
      const res = await axiosInstance.post('/auth/refresh-token', {
        refreshToken,
      });

      const newToken = res.data.token;
      const newRefreshToken = res.data.refreshToken;

      localStorage.setItem('eventsToken', newToken);
      localStorage.setItem('refreshToken', newRefreshToken);

      axiosInstance.defaults.headers.common['Authorization'] = 'Bearer ' + newToken;

      // console.log('Proaktivni refresh uspješan');
      return true;
    } catch (error) {
      console.log('Proaktivni refresh neuspješan', error);
      return false;
    } finally {
      isRefreshing = false;
    }
  }

  return true;
};

axiosInstance.interceptors.request.use(
  async (config) => {
    // Provjeri i osvježi token prije svakog zahtjeva
    await proactiveTokenRefresh();

    const token = localStorage.getItem('eventsToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

// Funkcija za čišćenje tokena i redirect na login
const handleTokenExpired = () => {
  localStorage.removeItem('eventsToken');
  localStorage.removeItem('refreshToken');

  // Resetuj axios default headers
  delete axiosInstance.defaults.headers.common['Authorization'];

  // Redirect na login
  // window.location.href = '/login';
  redirectToLogin('Uneseni korisnik ne postoji');
};

// Funkcija za provjeru da li je greška vezana za istekli token
const isTokenExpiredError = (error) => {
  const errorMessage = error.response?.data?.message || error.message || '';

  // Provjeri različite varijante poruke
  const expiredMessages = [
    'Token expired',
    'token expired',
    'Token has expired',
    'token has expired',
    'please login again',
    'Please login again',
  ];

  return expiredMessages.some((msg) => errorMessage.toLowerCase().includes(msg.toLowerCase()));
};

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const refreshToken = localStorage.getItem('refreshToken');

    const isUnauthorized = error.response?.status === 401 || error.response?.status === 403;

    // VAŽNO: Provjeri da li je greška vezana za istekli token
    // ALI samo ako se trenutno ne izvršava refresh proces
    if (isTokenExpiredError(error) && !isRefreshing) {
      redirectToLogin('Token expired');
      // console.log('Token expired i nije u toku refresh - redirecting to login');
      handleTokenExpired();
      return Promise.reject(error);
    }

    if (isUnauthorized && refreshToken) {
      if (originalRequest._retry) {
        // Token refresh već neuspješan jednom za ovaj request
        redirectToLogin('Token refresh failed');
        // console.log('Token refresh failed after retry - redirecting to login');
        handleTokenExpired();
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token) => {
              originalRequest.headers['Authorization'] = 'Bearer ' + token;
              resolve(axiosInstance(originalRequest));
            },
            reject: (err) => {
              reject(err);
            },
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // console.log('Pokrećem reaktivni token refresh...');
        const res = await axiosInstance.post('/auth/refresh-token', {
          refreshToken,
        });

        const newToken = res.data.token;
        const newRefreshToken = res.data.refreshToken;

        localStorage.setItem('eventsToken', newToken);
        localStorage.setItem('refreshToken', newRefreshToken);

        axiosInstance.defaults.headers.common['Authorization'] = 'Bearer ' + newToken;

        processQueue(null, newToken);
        // console.log('Reaktivni refresh uspješan');
        return axiosInstance(originalRequest);
      } catch (err) {
        processQueue(err, null);
        handleTokenExpired();
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    // Za sve ostale unauthorized greške bez refresh tokena
    if (isUnauthorized && !refreshToken) {
      redirectToLogin('No refresh token available');
      // console.log('No refresh token available - redirecting to login');
      handleTokenExpired();
    }

    return Promise.reject(error);
  }
);

// Dodatno: Postavi interval za periodičnu provjeru tokena (opcionalno)
let tokenCheckInterval;

const startTokenMonitoring = () => {
  // Provjeri token svakih 10 sekundi (jer token ističe svake minute)
  tokenCheckInterval = setInterval(() => {
    const token = localStorage.getItem('eventsToken');
    if (token && isTokenNearExpiry(token)) {
      proactiveTokenRefresh();
    }
  }, 10 * 1000); // 10 sekundi
};

const stopTokenMonitoring = () => {
  if (tokenCheckInterval) {
    clearInterval(tokenCheckInterval);
    tokenCheckInterval = null;
  }
};

// Pokreni monitoring kad se učita modul
startTokenMonitoring();

// Export funkcija za kontrolu monitoring-a
export { startTokenMonitoring, stopTokenMonitoring };
export default axiosInstance;
