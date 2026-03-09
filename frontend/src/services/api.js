import axios from 'axios';

const API = axios.create({
  baseURL: '/api',
  withCredentials: true,
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('flipmart_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('flipmart_token');
      localStorage.removeItem('flipmart_user');
      window.location.href = '/';
    }
    return Promise.reject(err);
  }
);

export const authAPI = {
  register: (data) => API.post('/auth/register', data),
  login: (data) => API.post('/auth/login', data),
  sendOTP: (phone) => API.post('/auth/send-otp', { phone }),
  verifyOTP: (data) => API.post('/auth/verify-otp', data),
  getMe: () => API.get('/auth/me'),
  updateProfile: (data) => API.put('/auth/profile', data),
  changePassword: (data) => API.put('/auth/password', data),
  addAddress: (data) => API.post('/auth/address', data),
  deleteAddress: (id) => API.delete(`/auth/address/${id}`),
  toggleWishlist: (productId) => API.post(`/auth/wishlist/${productId}`),
};

export const productAPI = {
  getAll: (params) => API.get('/products', { params }),
  getOne: (id) => API.get(`/products/${id}`),
  addReview: (id, data) => API.post(`/products/${id}/review`, data),
};

export const cartAPI = {
  get: () => API.get('/cart'),
  add: (productId, quantity) => API.post('/cart/add', { productId, quantity }),
  update: (productId, quantity) => API.put('/cart/update', { productId, quantity }),
  remove: (productId) => API.delete(`/cart/remove/${productId}`),
  clear: () => API.delete('/cart/clear'),
};

export const orderAPI = {
  place: (data) => API.post('/orders/place', data),
  getMine: () => API.get('/orders/mine'),
  getOne: (id) => API.get(`/orders/${id}`),
  cancel: (id, reason) => API.put(`/orders/${id}/cancel`, { reason }),
};

// 🎟️ COUPON API
export const couponAPI = {
  apply: (code, orderAmount) => API.post('/coupons/apply', { code, orderAmount }),
};

export default API;