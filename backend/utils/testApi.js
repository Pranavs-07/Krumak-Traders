/**
 * End-to-End API Integration Test Suite for KRUMAK TRADERS Backend
 * Tests all required REST endpoints in sequence against an in-memory or active database.
 */
const http = require('http');
const mongoose = require('mongoose');

// Helper to make HTTP requests
const request = (server, method, path, data = null, headers = {}) => {
  return new Promise((resolve, reject) => {
    const port = server.address().port;
    const bodyStr = data ? JSON.stringify(data) : null;

    const options = {
      hostname: '127.0.0.1',
      port,
      path,
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(bodyStr ? { 'Content-Length': Buffer.byteLength(bodyStr) } : {}),
        ...headers,
      },
    };

    const req = http.request(options, (res) => {
      let responseBody = '';
      res.on('data', (chunk) => (responseBody += chunk));
      res.on('end', () => {
        try {
          const parsed = responseBody ? JSON.parse(responseBody) : {};
          resolve({ status: res.statusCode, headers: res.headers, body: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, headers: res.headers, raw: responseBody });
        }
      });
    });

    req.on('error', (err) => reject(err));
    if (bodyStr) req.write(bodyStr);
    req.end();
  });
};

async function runTestSuite() {
  console.log('=============================================================');
  console.log('  STARTING KRUMAK TRADERS API INTEGRATION TEST SUITE  ');
  console.log('=============================================================');

  let mongod;
  let testMongoUri = process.env.MONGO_URI;

  try {
    const { MongoMemoryServer } = require('mongodb-memory-server');
    console.log('[Test Setup] Starting MongoMemoryServer for isolated test run...');
    mongod = await MongoMemoryServer.create();
    testMongoUri = mongod.getUri();
    process.env.MONGO_URI = testMongoUri;
  } catch (err) {
    console.log('[Test Setup] Using standard MONGO_URI:', testMongoUri);
  }

  // Set test environment
  process.env.NODE_ENV = 'test';
  process.env.PORT = '0'; // ephemeral port

  // Re-connect mongoose with test URI
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
  await mongoose.connect(testMongoUri);
  console.log('[Test Setup] Connected to test database:', testMongoUri);

  // Import app after setting test environment
  const { app } = require('../server');

  // Start test HTTP server on random free port
  const testServer = await new Promise((resolve) => {
    const s = app.listen(0, '127.0.0.1', () => resolve(s));
  });

  const testPort = testServer.address().port;
  console.log(`[Test Setup] Test server listening on http://127.0.0.1:${testPort}`);

  let passed = 0;
  let failed = 0;

  const assert = (condition, testName, details = '') => {
    if (condition) {
      console.log(`  ✓ [PASS] ${testName}`);
      passed++;
    } else {
      console.error(`  ✗ [FAIL] ${testName} - ${details}`);
      failed++;
    }
  };

  try {
    // -------------------------------------------------------------
    // 1. HEALTH CHECK
    // -------------------------------------------------------------
    console.log('\n--- 1. Health Check ---');
    const resHealth = await request(testServer, 'GET', '/api/health');
    assert(resHealth.status === 200, 'GET /api/health returns 200 OK');
    assert(resHealth.body.success === true, 'Health check response has success: true');

    // -------------------------------------------------------------
    // 2. AUTHENTICATION & PROFILE
    // -------------------------------------------------------------
    console.log('\n--- 2. Authentication & Authorization ---');

    // Register admin user
    const resRegAdmin = await request(testServer, 'POST', '/api/auth/register', {
      name: 'System Admin',
      email: 'admin@krumak.com',
      password: 'adminPassword123',
      phone: '+91 99999 11111',
      role: 'admin',
      company: 'KRUMAK Traders HQ',
    });
    assert(resRegAdmin.status === 201, 'POST /api/auth/register (Admin) returns 201');
    const adminToken = resRegAdmin.body.data?.token || resRegAdmin.body.token;
    assert(Boolean(adminToken), 'Admin token received on registration');

    // Register customer user
    const resRegCust = await request(testServer, 'POST', '/api/auth/register', {
      name: 'Dr. Anita Roy',
      email: 'anita.roy@labresearch.org',
      password: 'customerPassword123',
      phone: '+91 98765 00000',
      role: 'customer',
      company: 'Advanced Genomics Institute',
    });
    assert(resRegCust.status === 201, 'POST /api/auth/register (Customer) returns 201');
    const custToken = resRegCust.body.data?.token || resRegCust.body.token;
    const custRefreshToken = resRegCust.body.data?.refreshToken || resRegCust.body.refreshToken;
    assert(Boolean(custToken), 'Customer token received on registration');

    // Login test
    const resLogin = await request(testServer, 'POST', '/api/auth/login', {
      email: 'anita.roy@labresearch.org',
      password: 'customerPassword123',
    });
    assert(resLogin.status === 200, 'POST /api/auth/login returns 200');
    assert(resLogin.body.user?.email === 'anita.roy@labresearch.org', 'Login user payload matches email');

    const activeRefreshToken = resLogin.body.data?.refreshToken || resLogin.body.refreshToken || custRefreshToken;

    // Token refresh
    const resRefresh = await request(testServer, 'POST', '/api/auth/refresh-token', {
      refreshToken: activeRefreshToken,
    });
    assert(resRefresh.status === 200, 'POST /api/auth/refresh-token returns 200 with new access token');

    // Profile test: GET /api/auth/me
    const resMe = await request(testServer, 'GET', '/api/auth/me', null, {
      Authorization: `Bearer ${custToken}`,
    });
    assert(resMe.status === 200, 'GET /api/auth/me returns 200');
    assert(resMe.body.data?.user?.name === 'Dr. Anita Roy', 'Profile has correct user name');

    // Profile update: PUT /api/auth/profile
    const resUpdateProf = await request(
      testServer,
      'PUT',
      '/api/auth/profile',
      { phone: '+91 98765 99999', department: 'Molecular Biology' },
      { Authorization: `Bearer ${custToken}` }
    );
    assert(resUpdateProf.status === 200, 'PUT /api/auth/profile returns 200');
    assert(resUpdateProf.body.data?.user?.phone === '+91 98765 99999', 'Profile phone updated successfully');

    // Forgot password
    const resForgot = await request(testServer, 'POST', '/api/auth/forgot-password', {
      email: 'anita.roy@labresearch.org',
    });
    assert(resForgot.status === 200, 'POST /api/auth/forgot-password returns 200');
    const resetToken = resForgot.body.data?.resetToken;
    assert(Boolean(resetToken), 'Reset token returned for local verification');

    // Reset password
    const resReset = await request(testServer, 'POST', '/api/auth/reset-password', {
      resetToken,
      newPassword: 'newSecretPassword123',
    });
    assert(resReset.status === 200, 'POST /api/auth/reset-password returns 200');

    // -------------------------------------------------------------
    // 3. CATEGORIES
    // -------------------------------------------------------------
    console.log('\n--- 3. Category Management ---');

    // Create Category (admin only)
    const resCreateCat = await request(
      testServer,
      'POST',
      '/api/admin/categories',
      {
        name: 'Analytical Instruments',
        slug: 'analytical-instruments',
        description: 'Chromatography and spectrophotometry devices',
        icon: '🔬',
      },
      { Authorization: `Bearer ${adminToken}` }
    );
    assert(resCreateCat.status === 201, 'POST /api/admin/categories (Admin) returns 201');
    const catId = resCreateCat.body.data?.category?._id;

    // Unauthorized customer attempt to create category
    const resCatForbidden = await request(
      testServer,
      'POST',
      '/api/admin/categories',
      { name: 'Unauthorized Category' },
      { Authorization: `Bearer ${custToken}` }
    );
    assert(resCatForbidden.status === 403, 'Customer role blocked with 403 on admin category creation');

    // Public list categories
    const resListCat = await request(testServer, 'GET', '/api/categories');
    assert(resListCat.status === 200, 'GET /api/categories returns 200');
    assert(resListCat.body.categories?.length > 0, 'Categories list returned');

    // -------------------------------------------------------------
    // 4. PRODUCTS
    // -------------------------------------------------------------
    console.log('\n--- 4. Product Management ---');

    // Admin create product
    const resCreateProd = await request(
      testServer,
      'POST',
      '/api/admin/products',
      {
        name: 'High Performance Liquid Chromatograph HPLC-900',
        slug: 'hplc-900-test',
        description: 'Precision analytical liquid chromatography unit with UV detector.',
        shortDescription: 'HPLC system for pharmaceutical analysis',
        category: 'analytical-instruments',
        categoryRef: catId,
        price: 250000,
        originalPrice: 280000,
        stock: 8,
        stockQuantity: 8,
        brand: 'KRUMAK Precision',
        SKU: 'KRM-HPLC-900',
        isFeatured: true,
        specifications: { 'Flow Rate': '0.1-5 mL/min', 'Max Pressure': '400 bar' },
      },
      { Authorization: `Bearer ${adminToken}` }
    );
    assert(resCreateProd.status === 201, 'POST /api/admin/products (Admin) returns 201');
    const prodId = resCreateProd.body.data?.product?._id;

    // Public list products
    const resListProd = await request(testServer, 'GET', '/api/products?category=analytical-instruments');
    assert(resListProd.status === 200, 'GET /api/products returns 200');
    assert(resListProd.body.products?.length === 1, 'Filter by category returns matching product');

    // Product search
    const resSearch = await request(testServer, 'GET', '/api/products/search?q=Liquid');
    assert(resSearch.status === 200, 'GET /api/products/search returns 200');
    assert(resSearch.body.suggestions?.length >= 1, 'Search suggestions return matching product');

    // Single product by ID
    const resSingleProd = await request(testServer, 'GET', `/api/products/${prodId}`);
    assert(resSingleProd.status === 200, 'GET /api/products/:id returns 200');
    assert(resSingleProd.body.product?.name.includes('HPLC-900'), 'Product details contain correct title');

    // Update product (Admin)
    const resUpdateProd = await request(
      testServer,
      'PUT',
      `/api/admin/products/${prodId}`,
      { price: 240000, stock: 10 },
      { Authorization: `Bearer ${adminToken}` }
    );
    assert(resUpdateProd.status === 200, 'PUT /api/admin/products/:id returns 200');
    assert(resUpdateProd.body.data?.product?.price === 240000, 'Product price updated correctly');

    // Upload product image (Admin)
    const boundary = '----WebKitFormBoundary' + Math.random().toString(36).substring(2);
    const dummyImageBuffer = Buffer.from('GIF89a\x01\x00\x01\x00\x80\x00\x00\xff\xff\xff\x00\x00\x00!\xf9\x04\x01\x00\x00\x00\x00,\x00\x00\x00\x00\x01\x00\x01\x00\x00\x02\x02D\x01\x00;', 'binary');
    const multipartBody = Buffer.concat([
      Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="image"; filename="hplc_test.gif"\r\nContent-Type: image/gif\r\n\r\n`),
      dummyImageBuffer,
      Buffer.from(`\r\n--${boundary}--\r\n`),
    ]);

    const resUpload = await new Promise((resolve) => {
      const port = testServer.address().port;
      const upReq = http.request({
        hostname: '127.0.0.1',
        port,
        path: `/api/admin/products/${prodId}/upload-image`,
        method: 'POST',
        headers: {
          'Content-Type': `multipart/form-data; boundary=${boundary}`,
          'Content-Length': multipartBody.length,
          Authorization: `Bearer ${adminToken}`,
        },
      }, (res) => {
        let body = '';
        res.on('data', chunk => body += chunk);
        res.on('end', () => resolve({ status: res.statusCode, body: JSON.parse(body) }));
      });
      upReq.write(multipartBody);
      upReq.end();
    });
    assert(resUpload.status === 200, 'POST /api/admin/products/:id/upload-image returns 200');
    assert(Boolean(resUpload.body.data?.imageUrl), 'Product image uploaded and URL returned');

    // -------------------------------------------------------------
    // 5. CART
    // -------------------------------------------------------------
    console.log('\n--- 5. Cart Management ---');

    // Add product to cart
    const resAddToCart = await request(
      testServer,
      'POST',
      '/api/cart/add',
      { productId: prodId, quantity: 2 },
      { Authorization: `Bearer ${custToken}` }
    );
    assert(resAddToCart.status === 200, 'POST /api/cart/add returns 200');

    // Get user cart
    const resGetCart = await request(testServer, 'GET', '/api/cart', null, {
      Authorization: `Bearer ${custToken}`
    });
    assert(resGetCart.status === 200, 'GET /api/cart returns 200');
    assert(resGetCart.body.items?.length === 1, 'Cart contains added item');
    assert(resGetCart.body.items[0].quantity === 2, 'Cart item quantity is 2');

    // Update cart item quantity
    const resUpdateCart = await request(
      testServer,
      'PUT',
      '/api/cart/update',
      { productId: prodId, quantity: 3 },
      { Authorization: `Bearer ${custToken}` }
    );
    assert(resUpdateCart.status === 200, 'PUT /api/cart/update returns 200');

    // -------------------------------------------------------------
    // 6. ORDERS & DUMMY PAYMENT SERVICE
    // -------------------------------------------------------------
    console.log('\n--- 6. Orders & Payment Service Simulation ---');

    // Place order with successful dummy payment
    const resCreateOrder = await request(
      testServer,
      'POST',
      '/api/orders',
      {
        items: [
          {
            productId: prodId,
            name: 'HPLC-900 Unit',
            price: 240000,
            quantity: 1,
          },
        ],
        shippingAddress: {
          address: 'Lab 301, Research Complex',
          city: 'Bangalore',
          state: 'Karnataka',
          pincode: '560012',
          country: 'India',
        },
        paymentMethod: 'card',
        simulatePaymentFailure: false,
      },
      { Authorization: `Bearer ${custToken}` }
    );

    assert(resCreateOrder.status === 201, 'POST /api/orders returns 201 Created');
    const createdOrderId = resCreateOrder.body.data?.order?.orderId;
    const paymentStatus = resCreateOrder.body.data?.order?.paymentStatus;
    assert(paymentStatus === 'paid', 'Dummy payment gateway returned status: paid');
    assert(resCreateOrder.body.data?.paymentResult?.gateway === 'DUMMY_GATEWAY', 'Payment gateway tagged as DUMMY_GATEWAY');

    // Verify order stock deduction
    const resProdAfterOrder = await request(testServer, 'GET', `/api/products/${prodId}`);
    assert(resProdAfterOrder.body.product?.stock === 9, 'Product inventory reduced from 10 to 9 after purchase');

    // Customer get their orders: GET /api/orders
    const resMyOrders = await request(testServer, 'GET', '/api/orders', null, {
      Authorization: `Bearer ${custToken}`,
    });
    assert(resMyOrders.status === 200, 'GET /api/orders returns 200');
    assert(resMyOrders.body.orders?.length >= 1, 'Customer can see their orders');

    // Admin view all orders: GET /api/admin/orders
    const resAdminOrders = await request(testServer, 'GET', '/api/admin/orders', null, {
      Authorization: `Bearer ${adminToken}`,
    });
    assert(resAdminOrders.status === 200, 'GET /api/admin/orders (Admin) returns 200');
    assert(resAdminOrders.body.orders?.length >= 1, 'Admin can see all platform orders');

    // Admin update order status: PUT /api/admin/orders/:id/status
    const resUpdateOrderStatus = await request(
      testServer,
      'PUT',
      `/api/admin/orders/${createdOrderId}/status`,
      { status: 'shipped' },
      { Authorization: `Bearer ${adminToken}` }
    );
    assert(resUpdateOrderStatus.status === 200, 'PUT /api/admin/orders/:id/status returns 200');
    assert(resUpdateOrderStatus.body.data?.order?.orderStatus === 'shipped', 'Order status changed to shipped');

    // -------------------------------------------------------------
    // 7. INQUIRIES / QUOTE REQUESTS
    // -------------------------------------------------------------
    console.log('\n--- 7. Inquiries / Quote Requests ---');

    // Submit public RFQ
    const resSubmitInquiry = await request(testServer, 'POST', '/api/inquiries', {
      name: 'Dr. Suresh Menon',
      email: 'suresh@iiscon.ac.in',
      phone: '+91 98450 12345',
      companyName: 'IISc Materials Testing',
      productInterest: 'HPLC-900 Unit',
      quantity: '2 units',
      message: 'Need educational discount and on-site training details.',
    });
    assert(resSubmitInquiry.status === 201, 'POST /api/inquiries returns 201 Created');
    const inqRefId = resSubmitInquiry.body.data?.inquiry?.inquiryId;

    // Admin view inquiries: GET /api/admin/inquiries
    const resAdminInquiries = await request(testServer, 'GET', '/api/admin/inquiries', null, {
      Authorization: `Bearer ${adminToken}`,
    });
    assert(resAdminInquiries.status === 200, 'GET /api/admin/inquiries (Admin) returns 200');
    assert(resAdminInquiries.body.inquiries?.length >= 1, 'Admin can list inquiries');

    // Admin update inquiry status: PUT /api/admin/inquiries/:id/status
    const resUpdateInq = await request(
      testServer,
      'PUT',
      `/api/admin/inquiries/${inqRefId}/status`,
      { status: 'resolved', response: 'Formal quote sent via email.' },
      { Authorization: `Bearer ${adminToken}` }
    );
    assert(resUpdateInq.status === 200, 'PUT /api/admin/inquiries/:id/status returns 200');
    assert(resUpdateInq.body.data?.inquiry?.status === 'resolved', 'Inquiry marked as resolved');

    // -------------------------------------------------------------
    // 8. ADMIN DASHBOARD & USERS
    // -------------------------------------------------------------
    console.log('\n--- 8. Admin Dashboard & User Management ---');

    // Admin list all users: GET /api/admin/users
    const resAdminUsers = await request(testServer, 'GET', '/api/admin/users', null, {
      Authorization: `Bearer ${adminToken}`,
    });
    assert(resAdminUsers.status === 200, 'GET /api/admin/users returns 200');
    assert(resAdminUsers.body.users?.length >= 2, 'Admin receives all registered accounts with stats');

    // Admin dashboard stats: GET /api/admin/dashboard-stats
    const resDashboardStats = await request(testServer, 'GET', '/api/admin/dashboard-stats', null, {
      Authorization: `Bearer ${adminToken}`,
    });
    assert(resDashboardStats.status === 200, 'GET /api/admin/dashboard-stats returns 200');
    assert(resDashboardStats.body.totalOrders >= 1, 'Dashboard stats includes total orders');
    assert(resDashboardStats.body.totalRevenue > 0, 'Dashboard stats includes total revenue');

    // Admin dashboard combined: GET /api/admin/dashboard
    const resDashboard = await request(testServer, 'GET', '/api/admin/dashboard', null, {
      Authorization: `Bearer ${adminToken}`,
    });
    assert(resDashboard.status === 200, 'GET /api/admin/dashboard returns 200');
    assert(Array.isArray(resDashboard.body.recentOrders), 'Dashboard contains recent orders feed');
  } catch (err) {
    console.error('[Test Error] Exception occurred during testing:', err);
    failed++;
  } finally {
    // Teardown
    testServer.close();
    await mongoose.disconnect();
    if (mongod) await mongod.stop();

    console.log('\n=============================================================');
    console.log(`  TEST RESULTS: ${passed} PASSED | ${failed} FAILED  `);
    console.log('=============================================================');

    if (failed > 0) {
      process.exit(1);
    } else {
      process.exit(0);
    }
  }
}

runTestSuite();
