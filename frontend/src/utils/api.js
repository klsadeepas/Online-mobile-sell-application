import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// Add token to requests
API.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

// Auth APIs
export const authAPI = {
  register: (data) => API.post('/auth/register', data),
  login: (data) => API.post('/auth/login', data),
  getProfile: () => API.get('/auth/profile'),
  updateProfile: (data) => API.put('/auth/profile', data),
  addToWishlist: (productId) => API.post(`/auth/wishlist/${productId}`),
  removeFromWishlist: (productId) => API.delete(`/auth/wishlist/${productId}`),
};

// Product APIs
export const productAPI = {
  getProducts: (params) => API.get('/products', { params }),
  getFeaturedProducts: () => API.get('/products/featured'),
  getFlashSaleProducts: () => API.get('/products/flash-sales'),
  getProductById: (id) => API.get(`/products/${id}`),
  getRelatedProducts: (id) => API.get(`/products/${id}/related`),
  getBrands: () => API.get('/products/brands'),
  createProduct: (data) => API.post('/products', data),
  updateProduct: (id, data) => API.put(`/products/${id}`, data),
  deleteProduct: (id) => API.delete(`/products/${id}`),
};

// Cart APIs
export const cartAPI = {
  getCart: (userId) => API.get(`/cart/${userId}`),
  addToCart: (data) => API.post('/cart', data),
  updateCartItem: (userId, itemId, quantity) => API.put(`/cart/${userId}/${itemId}`, { quantity }),
  removeFromCart: (userId, itemId) => API.delete(`/cart/${userId}/${itemId}`),
  clearCart: (userId) => API.delete(`/cart/${userId}`),
};

// Order APIs
export const orderAPI = {
  createOrder: (data) => API.post('/orders', data),
  getUserOrders: (userId) => API.get(`/orders/user/${userId}`),
  getOrders: (params) => API.get('/orders', { params }),
  getOrderById: (id) => API.get(`/orders/${id}`),
  updateOrderStatus: (id, orderStatus) => API.put(`/orders/${id}/status`, { orderStatus }),
  cancelOrder: (id) => API.put(`/orders/${id}/cancel`),
  getOrderStats: () => API.get('/orders/stats'),
};

// User APIs
export const userAPI = {
  getUsers: (params) => API.get('/users', { params }),
  getUserById: (id) => API.get(`/users/${id}`),
  deleteUser: (id) => API.delete(`/users/${id}`),
  getUserStats: () => API.get('/users/stats'),
};

// Review APIs
export const reviewAPI = {
  createReview: (data) => API.post('/reviews', data),
  getProductReviews: (productId) => API.get(`/reviews/product/${productId}`),
  getAllReviews: (params) => API.get('/reviews', { params }),
  updateReview: (id, data) => API.put(`/reviews/${id}`, data),
  deleteReview: (id) => API.delete(`/reviews/${id}`),
};

// Coupon APIs
export const couponAPI = {
  getCoupons: () => API.get('/coupons'),
  validateCoupon: (data) => API.post('/coupons/validate', data),
  createCoupon: (data) => API.post('/coupons', data),
  updateCoupon: (id, data) => API.put(`/coupons/${id}`, data),
  deleteCoupon: (id) => API.delete(`/coupons/${id}`),
};

export default API;