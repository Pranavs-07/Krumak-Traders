/**
 * API Service Functions for KRUMAK TRADERS
 * Each function maps to a specific backend REST API endpoint.
 * Falls back to mock data when the backend is unavailable.
 */
import api from './api';
import { products as mockProducts, categories as mockCategories } from './mockData';

// ==================== AUTH SERVICES ====================

export const authService = {
  /** POST /api/auth/register */
  register: async (data) => {
    try {
      const res = await api.post('/auth/register', data);
      return res.data;
    } catch (err) {
      // Mock: simulate registration success
      return { success: true, message: 'Registration successful', user: { id: '1', name: data.name, email: data.email, role: 'customer' }, token: 'mock-jwt-token-' + Date.now() };
    }
  },

  /** POST /api/auth/login */
  login: async (data) => {
    try {
      const res = await api.post('/auth/login', data);
      return res.data;
    } catch (err) {
      // Mock: simulate login
      if (data.email === 'admin@krumak.com' && data.password === 'admin123') {
        return { success: true, user: { id: '0', name: 'Admin', email: data.email, role: 'admin' }, token: 'mock-admin-token' };
      }
      return { success: true, user: { id: '1', name: 'Test User', email: data.email, role: 'customer' }, token: 'mock-jwt-token-' + Date.now() };
    }
  },

  /** POST /api/auth/forgot-password */
  forgotPassword: async (email) => {
    try {
      const res = await api.post('/auth/forgot-password', { email });
      return res.data;
    } catch (err) {
      return { success: true, message: 'Password reset link sent to your email' };
    }
  },

  /** GET /api/auth/profile */
  getProfile: async () => {
    try {
      const res = await api.get('/auth/profile');
      return res.data;
    } catch (err) {
      return null;
    }
  },

  /** PUT /api/auth/profile */
  updateProfile: async (data) => {
    try {
      const res = await api.put('/auth/profile', data);
      return res.data;
    } catch (err) {
      return { success: true, message: 'Profile updated', user: data };
    }
  },
};

// ==================== PRODUCT SERVICES ====================

export const productService = {
  /** GET /api/products?category=X&search=X&page=X&limit=X&minPrice=X&maxPrice=X&sort=X */
  getProducts: async (params = {}) => {
    try {
      const res = await api.get('/products', { params });
      return res.data;
    } catch (err) {
      // Mock: filter and paginate products
      let filtered = [...mockProducts];
      if (params.category) filtered = filtered.filter(p => p.category === params.category);
      if (params.search) {
        const s = params.search.toLowerCase();
        filtered = filtered.filter(p => p.name.toLowerCase().includes(s) || p.shortDescription.toLowerCase().includes(s));
      }
      if (params.minPrice) filtered = filtered.filter(p => p.price >= Number(params.minPrice));
      if (params.maxPrice) filtered = filtered.filter(p => p.price <= Number(params.maxPrice));
      const page = Number(params.page) || 1;
      const limit = Number(params.limit) || 12;
      const start = (page - 1) * limit;
      return {
        products: filtered.slice(start, start + limit),
        total: filtered.length,
        page,
        totalPages: Math.ceil(filtered.length / limit),
      };
    }
  },

  /** GET /api/products/:id */
  getProduct: async (id) => {
    try {
      const res = await api.get(`/products/${id}`);
      return res.data;
    } catch (err) {
      const product = mockProducts.find(p => p.id === id || p.slug === id);
      return { product, related: mockProducts.filter(p => p.category === product?.category && p.id !== product?.id).slice(0, 4) };
    }
  },

  /** GET /api/products/categories */
  getCategories: async () => {
    try {
      const res = await api.get('/products/categories');
      return res.data;
    } catch (err) {
      return { categories: mockCategories };
    }
  },

  /** GET /api/products/search?q=X */
  searchProducts: async (query) => {
    try {
      const res = await api.get('/products/search', { params: { q: query } });
      return res.data;
    } catch (err) {
      const s = query.toLowerCase();
      return { suggestions: mockProducts.filter(p => p.name.toLowerCase().includes(s)).slice(0, 5).map(p => ({ id: p.id, name: p.name, slug: p.slug, price: p.price, image: p.image })) };
    }
  },
};

// ==================== CART SERVICES ====================

export const cartService = {
  /** GET /api/cart */
  getCart: async () => {
    try {
      const res = await api.get('/cart');
      return res.data;
    } catch (err) {
      return { items: [] };
    }
  },

  /** POST /api/cart { productId, quantity } */
  addToCart: async (productId, quantity = 1) => {
    try {
      const res = await api.post('/cart', { productId, quantity });
      return res.data;
    } catch (err) {
      return { success: true, message: 'Item added to cart' };
    }
  },

  /** PUT /api/cart/:itemId { quantity } */
  updateCartItem: async (itemId, quantity) => {
    try {
      const res = await api.put(`/cart/${itemId}`, { quantity });
      return res.data;
    } catch (err) {
      return { success: true };
    }
  },

  /** DELETE /api/cart/:itemId */
  removeFromCart: async (itemId) => {
    try {
      const res = await api.delete(`/cart/${itemId}`);
      return res.data;
    } catch (err) {
      return { success: true };
    }
  },
};

// ==================== ORDER SERVICES ====================

export const orderService = {
  /** POST /api/orders { items, shippingAddress, billingAddress, paymentMethod } */
  createOrder: async (data) => {
    try {
      const res = await api.post('/orders', data);
      return res.data;
    } catch (err) {
      return { success: true, order: { id: 'KRM-' + Date.now().toString(36).toUpperCase(), status: 'pending', ...data, createdAt: new Date().toISOString() } };
    }
  },

  /** GET /api/orders */
  getOrders: async () => {
    try {
      const res = await api.get('/orders');
      return res.data;
    } catch (err) {
      return { orders: [] };
    }
  },

  /** GET /api/orders/:id */
  getOrder: async (id) => {
    try {
      const res = await api.get(`/orders/${id}`);
      return res.data;
    } catch (err) {
      return { order: null };
    }
  },
};

// ==================== INQUIRY SERVICES ====================

export const inquiryService = {
  /** POST /api/inquiries { name, email, phone, company, products, quantity, message } */
  submitInquiry: async (data) => {
    try {
      const res = await api.post('/inquiries', data);
      return res.data;
    } catch (err) {
      return { success: true, message: 'Your inquiry has been submitted successfully. Our team will contact you shortly.', inquiry: { id: 'INQ-' + Date.now().toString(36).toUpperCase(), ...data, status: 'open', createdAt: new Date().toISOString() } };
    }
  },

  /** GET /api/inquiries */
  getInquiries: async () => {
    try {
      const res = await api.get('/inquiries');
      return res.data;
    } catch (err) {
      return { inquiries: [] };
    }
  },
};

// ==================== ADMIN SERVICES ====================

export const adminService = {
  /** GET /api/admin/dashboard */
  getDashboard: async () => {
    try {
      const res = await api.get('/admin/dashboard');
      return res.data;
    } catch (err) {
      return {
        totalOrders: 156, totalRevenue: 2450000, totalProducts: mockProducts.length, totalUsers: 89,
        recentOrders: [
          { id: 'KRM-A1B2C3', customer: 'Dr. Rajesh Kumar', total: 245000, status: 'confirmed', date: '2024-01-15' },
          { id: 'KRM-D4E5F6', customer: 'AIIMS Lab', total: 175000, status: 'shipped', date: '2024-01-14' },
          { id: 'KRM-G7H8I9', customer: 'IIT Bombay', total: 68000, status: 'pending', date: '2024-01-13' },
          { id: 'KRM-J0K1L2', customer: 'Ranbaxy Labs', total: 520000, status: 'delivered', date: '2024-01-12' },
        ],
        lowStockProducts: mockProducts.filter(p => p.stock < 10).map(p => ({ id: p.id, name: p.name, stock: p.stock, category: p.category })),
      };
    }
  },

  /** POST /api/products (admin create) */
  createProduct: async (data) => {
    try {
      const res = await api.post('/products', data);
      return res.data;
    } catch (err) {
      return { success: true, product: { id: Date.now().toString(), ...data } };
    }
  },

  /** PUT /api/products/:id (admin update) */
  updateProduct: async (id, data) => {
    try {
      const res = await api.put(`/products/${id}`, data);
      return res.data;
    } catch (err) {
      return { success: true, product: { id, ...data } };
    }
  },

  /** DELETE /api/products/:id (admin delete) */
  deleteProduct: async (id) => {
    try {
      const res = await api.delete(`/products/${id}`);
      return res.data;
    } catch (err) {
      return { success: true };
    }
  },

  /** GET /api/admin/orders */
  getAllOrders: async () => {
    try {
      const res = await api.get('/admin/orders');
      return res.data;
    } catch (err) {
      return { orders: [
        { id: 'KRM-A1B2C3', customer: { name: 'Dr. Rajesh Kumar', email: 'rajesh@iitd.ac.in' }, items: [{ name: 'HPLC System', quantity: 1, price: 245000 }], total: 245000, status: 'confirmed', createdAt: '2024-01-15T10:30:00Z' },
        { id: 'KRM-D4E5F6', customer: { name: 'Prof. Anita Sharma', email: 'anita@aiims.edu' }, items: [{ name: 'Centrifuge', quantity: 1, price: 175000 }], total: 175000, status: 'shipped', createdAt: '2024-01-14T14:20:00Z' },
        { id: 'KRM-G7H8I9', customer: { name: 'Vikram Singh', email: 'vikram@ranbaxy.com' }, items: [{ name: 'Analytical Balance', quantity: 2, price: 68000 }], total: 136000, status: 'pending', createdAt: '2024-01-13T09:15:00Z' },
      ]};
    }
  },

  /** PUT /api/admin/orders/:id { status } */
  updateOrderStatus: async (id, status) => {
    try {
      const res = await api.put(`/admin/orders/${id}`, { status });
      return res.data;
    } catch (err) {
      return { success: true };
    }
  },

  /** GET /api/admin/inquiries */
  getAllInquiries: async () => {
    try {
      const res = await api.get('/admin/inquiries');
      return res.data;
    } catch (err) {
      return { inquiries: [
        { id: 'INQ-001', name: 'Dr. Priya Patel', email: 'priya@bits.ac.in', phone: '9876543210', company: 'BITS Pilani', productInterest: 'Educational Kits', quantity: '50', message: 'Need bulk pricing for chemistry and biology educational kits.', status: 'open', createdAt: '2024-01-15T08:00:00Z' },
        { id: 'INQ-002', name: 'Mr. Arun Mehta', email: 'arun@tcs.com', phone: '9876543211', company: 'TCS Labs', productInterest: 'HPLC System', quantity: '3', message: 'Setting up new QC lab. Need quote for 3 HPLC systems with installation.', status: 'resolved', createdAt: '2024-01-12T11:00:00Z' },
      ]};
    }
  },

  /** PUT /api/admin/inquiries/:id { status, response } */
  updateInquiry: async (id, data) => {
    try {
      const res = await api.put(`/admin/inquiries/${id}`, data);
      return res.data;
    } catch (err) {
      return { success: true };
    }
  },

  /** GET /api/admin/users */
  getAllUsers: async () => {
    try {
      const res = await api.get('/admin/users');
      return res.data;
    } catch (err) {
      return { users: [
        { id: '1', name: 'Dr. Rajesh Kumar', email: 'rajesh@iitd.ac.in', role: 'customer', orders: 12, joined: '2023-03-15' },
        { id: '2', name: 'Prof. Anita Sharma', email: 'anita@aiims.edu', role: 'customer', orders: 8, joined: '2023-05-20' },
        { id: '3', name: 'Vikram Singh', email: 'vikram@ranbaxy.com', role: 'customer', orders: 23, joined: '2023-01-10' },
      ]};
    }
  },
};
