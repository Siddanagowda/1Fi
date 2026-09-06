// API client for communicating with backend
const API_BASE_URL = 'http://localhost:5000/api';

export const apiClient = {
  // User endpoints
  registerUser: (userData) =>
    fetch(`${API_BASE_URL}/users/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    }).then((res) => res.json()),

  loginUser: (email, password) =>
    fetch(`${API_BASE_URL}/users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    }).then((res) => res.json()),

  getUsers: () =>
    fetch(`${API_BASE_URL}/users`).then((res) => res.json()),

  getUserById: (id) =>
    fetch(`${API_BASE_URL}/users/${id}`).then((res) => res.json()),

  updateUser: (id, userData) =>
    fetch(`${API_BASE_URL}/users/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    }).then((res) => res.json()),

  deleteUser: (id) =>
    fetch(`${API_BASE_URL}/users/${id}`, { method: 'DELETE' }).then((res) => res.json()),

  // Product endpoints
  createProduct: (productData) =>
    fetch(`${API_BASE_URL}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productData),
    }).then((res) => res.json()),

  getProducts: (search, category, limit = 20, offset = 0) => {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (category) params.append('category', category);
    params.append('limit', limit);
    params.append('offset', offset);
    return fetch(`${API_BASE_URL}/products?${params}`).then((res) => res.json());
  },

  getProductById: (id) =>
    fetch(`${API_BASE_URL}/products/${id}`).then((res) => res.json()),

  updateProduct: (id, productData) =>
    fetch(`${API_BASE_URL}/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productData),
    }).then((res) => res.json()),

  deleteProduct: (id) =>
    fetch(`${API_BASE_URL}/products/${id}`, { method: 'DELETE' }).then((res) => res.json()),

  getProductsBySeller: (sellerId) =>
    fetch(`${API_BASE_URL}/products/seller/${sellerId}`).then((res) => res.json()),

  // EMI endpoints
  getEMIPlans: (productId) =>
    fetch(`${API_BASE_URL}/emi/product/${productId}`).then((res) => res.json()),

  getEMIPlanById: (id) =>
    fetch(`${API_BASE_URL}/emi/${id}`).then((res) => res.json()),

  createEMIPlan: (emiData) =>
    fetch(`${API_BASE_URL}/emi`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(emiData),
    }).then((res) => res.json()),

  updateEMIPlan: (id, emiData) =>
    fetch(`${API_BASE_URL}/emi/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(emiData),
    }).then((res) => res.json()),

  deleteEMIPlan: (id) =>
    fetch(`${API_BASE_URL}/emi/${id}`, { method: 'DELETE' }).then((res) => res.json()),

  // Variant endpoints
  getVariants: (productId) =>
    fetch(`${API_BASE_URL}/variants/product/${productId}`).then((res) => res.json()),

  getVariantById: (id) =>
    fetch(`${API_BASE_URL}/variants/${id}`).then((res) => res.json()),

  createVariant: (variantData) =>
    fetch(`${API_BASE_URL}/variants`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(variantData),
    }).then((res) => res.json()),

  updateVariant: (id, variantData) =>
    fetch(`${API_BASE_URL}/variants/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(variantData),
    }).then((res) => res.json()),

  deleteVariant: (id) =>
    fetch(`${API_BASE_URL}/variants/${id}`, { method: 'DELETE' }).then((res) => res.json()),

  // Order endpoints
  createOrder: (orderData) =>
    fetch(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData),
    }).then((res) => res.json()),

  getOrders: () =>
    fetch(`${API_BASE_URL}/orders`).then((res) => res.json()),

  getOrderById: (id) =>
    fetch(`${API_BASE_URL}/orders/${id}`).then((res) => res.json()),

  updateOrderStatus: (id, status) =>
    fetch(`${API_BASE_URL}/orders/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    }).then((res) => res.json()),

  deleteOrder: (id) =>
    fetch(`${API_BASE_URL}/orders/${id}`, { method: 'DELETE' }).then((res) => res.json()),

  getOrdersByBuyer: (buyerId) =>
    fetch(`${API_BASE_URL}/orders/buyer/${buyerId}`).then((res) => res.json()),

  getOrdersBySeller: (sellerId) =>
    fetch(`${API_BASE_URL}/orders/seller/${sellerId}`).then((res) => res.json()),

  // Health check
  healthCheck: () =>
    fetch(`${API_BASE_URL}/health`).then((res) => res.json()),
};
