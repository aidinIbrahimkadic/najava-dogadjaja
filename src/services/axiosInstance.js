// //AXIOS INSTANCA

// import axios from 'axios';

// const API_URL = 'https://events-opcina.poruci.ba/api';

// const axiosInstance = axios.create({
//   baseURL: API_URL,
// });

// axiosInstance.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem('eventsToken');
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// // Auto-refresh token on 401
// axiosInstance.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;
//     if (
//       (error.response?.status === 401 || error.response?.status === 403) &&
//       !originalRequest._retry &&
//       localStorage.getItem('eventsRefreshToken')
//     ) {
//       originalRequest._retry = true;
//       try {
//         const refreshToken = localStorage.getItem('eventsRefreshToken');
//         const response = await axios.post(
//           'https://events-opcina.poruci.ba/api/auth/refresh-token',
//           {
//             refreshToken,
//           }
//         );

//         const newToken = response.data.token;
//         localStorage.setItem('eventsToken', newToken);
//         axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
//         originalRequest.headers['Authorization'] = `Bearer ${newToken}`;

//         return axiosInstance(originalRequest);
//       } catch (refreshError) {
//         // Refresh token failed → force logout
//         localStorage.removeItem('eventsToken');
//         localStorage.removeItem('eventsRefreshToken');
//         window.location.href = '/login';
//         return Promise.reject(refreshError);
//       }
//     }

//     return Promise.reject(error);
//   }
// );

// export default axiosInstance;

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

let isRefreshing = false;
let failedQueue = [];

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

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const refreshToken = localStorage.getItem('refreshToken');

    const isUnauthorized = error.response?.status === 401 || error.response?.status === 403;

    if (isUnauthorized && refreshToken) {
      if (originalRequest._retry) {
        // Token refresh already failed once for this request → don't retry again
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
        const res = await axiosInstance.post('/auth/refresh-token', {
          refreshToken,
        });

        const newToken = res.data.token;
        const newRefreshToken = res.data.refreshToken;

        localStorage.setItem('eventsToken', newToken);
        localStorage.setItem('refreshToken', newRefreshToken);

        axiosInstance.defaults.headers.common['Authorization'] = 'Bearer ' + newToken;

        processQueue(null, newToken);
        return axiosInstance(originalRequest);
      } catch (err) {
        processQueue(err, null);
        localStorage.removeItem('eventsToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
