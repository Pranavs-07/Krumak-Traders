# KRUMAK TRADERS - Backend REST API

Production-ready Node.js, Express.js, and MongoDB (Mongoose) REST API for **KRUMAK TRADERS**, a premier laboratory and scientific equipment trading firm. Designed to connect seamlessly with the Next.js institutional procurement frontend.

---

## 🏗️ Architecture & Features

- **Runtime & Framework**: Node.js + Express.js
- **Database & ODM**: MongoDB with Mongoose Schema validation, text search indexing, and virtual attributes
- **Authentication**: JWT-based access tokens (24h) + long-lived refresh tokens (7d)
- **Password Security**: Salted bcrypt hashing with pre-save hooks
- **File Uploads**: Multer local disk storage with image mimetype/size verification
- **Validation**: express-validator with centralized error formatting
- **Rate Limiting**: express-rate-limit protection on authentication routes
- **Pluggable Payment Gateway**: Modular `paymentService.js` with simulated dummy gateway and drop-in integration hooks for Razorpay and Stripe
- **Centralized Error Handling**: Captures Mongoose CastError, duplicate key (11000), validation errors, and JWT expiration
- **Role-Based Access Control**: `customer` and `admin` roles protecting `/api/admin/*` routes

---

## 📁 Folder Structure

```
backend/
├── config/
│   ├── constants.js          # Roles, order, payment & inquiry enums
│   └── db.js                 # MongoDB connection logic
├── controllers/
│   ├── adminController.js    # Dashboard stats, user listings, activity audit
│   ├── authController.js     # Register, login, refresh, profile, password reset
│   ├── cartController.js     # User cart management & item quantity updates
│   ├── categoryController.js # Equipment categories & hierarchy
│   ├── inquiryController.js  # RFQ and quote submission
│   ├── orderController.js    # Orders, checkout, inventory deduction
│   └── productController.js  # Product catalog, filters, search, image upload
├── middleware/
│   ├── auth.js               # JWT verification (protect, optionalAuth, authorize)
│   ├── errorHandler.js       # Centralized error handler
│   ├── rateLimiter.js        # Auth and API rate limiters
│   ├── upload.js             # Multer configuration for file uploads
│   └── validator.js          # Request validation rules & result handlers
├── models/
│   ├── ActivityLog.js        # Admin operation audit log
│   ├── Cart.js               # User cart with subtotal/tax virtuals
│   ├── Category.js           # Category model with parent-child support
│   ├── Inquiry.js            # Quote requests & B2B inquiries
│   ├── Order.js              # Order with dummy payment snapshot
│   ├── Product.js            # Laboratory equipment product catalog
│   └── User.js               # User accounts with bcrypt hashing
├── routes/
│   ├── adminRoutes.js        # /api/admin/* endpoints
│   ├── authRoutes.js         # /api/auth/* endpoints
│   ├── cartRoutes.js         # /api/cart/* endpoints
│   ├── categoryRoutes.js     # /api/categories/* endpoints
│   ├── inquiryRoutes.js      # /api/inquiries/* endpoints
│   ├── orderRoutes.js        # /api/orders/* endpoints
│   └── productRoutes.js      # /api/products/* endpoints
├── seeds/
│   └── seeder.js             # Seeds sample categories, products, orders, users
├── services/
│   ├── activityLogger.js     # Admin activity tracker
│   └── paymentService.js     # Dummy payment gateway (Razorpay/Stripe ready)
├── utils/
│   ├── generateTokens.js     # JWT creation & verification utilities
│   ├── helpers.js            # Standardized API response formatter & pagination
│   └── testApi.js            # End-to-end integration test suite
├── uploads/                  # Uploaded product images
├── .env.example              # Environment variables template
├── .env                      # Active environment configuration
├── package.json              # Backend dependencies and scripts
└── server.js                 # Express application entry point
```

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js** (v18 or higher, tested on Node v24)
- **MongoDB** (local `mongod` instance or a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster)

### 2. Environment Configuration
Copy the sample environment file:
```bash
cd backend
cp .env.example .env
```

Ensure `MONGO_URI` points to your MongoDB instance:
```env
PORT=8000
NODE_ENV=development
CLIENT_URL=http://localhost:3000
MONGO_URI=mongodb://127.0.0.1:27017/krumak_traders
JWT_SECRET=krumak_super_secret_jwt_access_key_2026_production_ready
JWT_EXPIRE=24h
JWT_REFRESH_SECRET=krumak_super_secret_jwt_refresh_key_2026_long_lived
JWT_REFRESH_EXPIRE=7d
PAYMENT_GATEWAY_MODE=dummy
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Seed the Database
Populate 14 scientific equipment categories, realistic lab products (HPLC, Centrifuges, Spectrophotometers), admin/customer accounts, sample inquiries, and orders:
```bash
npm run seed
```

*To wipe and reset:* `npm run seed:destroy`

#### Default Seed Accounts:
- **Admin**: `admin@krumak.com` / `admin123`
- **Customer**: `customer@laboratory.org` / `password123`

### 5. Start the Server
- Development (with Nodemon):
  ```bash
  npm run dev
  ```
- Production:
  ```bash
  npm start
  ```
The server will start at `http://localhost:8000/api`.

### 6. Run Integration Test Suite
Verify all 58 endpoint behaviors against an in-memory database:
```bash
npm run test:api
```

---

## 📡 REST API Reference

All successful responses follow the standardized envelope:
```json
{
  "success": true,
  "message": "Human readable message",
  "data": { ... },
  "error": null
}
```

### Authentication (`/api/auth`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | Public | Register customer or admin user |
| `POST` | `/api/auth/login` | Public | Log in with email & password, returns JWT pair |
| `POST` | `/api/auth/logout` | Protected | Invalidate refresh token |
| `POST` | `/api/auth/refresh-token` | Public | Generate new access token from refresh token |
| `POST` | `/api/auth/forgot-password` | Public | Request password reset token |
| `POST` | `/api/auth/reset-password` | Public | Reset password using reset token |
| `GET` | `/api/auth/me` | Protected | Retrieve logged-in user profile |
| `PUT` | `/api/auth/profile` | Protected | Update profile information |

### Products (`/api/products`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/products` | Public | Filtered list (`category`, `search`, `minPrice`, `maxPrice`, `page`, `limit`, `sort`) |
| `GET` | `/api/products/:id` | Public | Get product by ID or slug with related items |
| `GET` | `/api/products/search` | Public | Search autocomplete suggestions |
| `GET` | `/api/products/categories` | Public | Distinct categories list |
| `POST` | `/api/admin/products` | Admin | Create product |
| `PUT` | `/api/admin/products/:id` | Admin | Update product |
| `DELETE` | `/api/admin/products/:id` | Admin | Delete product |
| `POST` | `/api/admin/products/:id/upload-image` | Admin | Upload product image (Multer) |

### Categories (`/api/categories`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/categories` | Public | List all categories with parent hierarchy |
| `POST` | `/api/admin/categories` | Admin | Create new category |
| `PUT` | `/api/admin/categories/:id` | Admin | Update category |
| `DELETE` | `/api/admin/categories/:id` | Admin | Delete category |

### Cart (`/api/cart`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/cart` | Protected | Fetch user's shopping cart |
| `POST` | `/api/cart/add` | Protected | Add product to cart |
| `PUT` | `/api/cart/update` | Protected | Update item quantity in cart |
| `DELETE` | `/api/cart/remove/:productId` | Protected | Remove item from cart |
| `DELETE` | `/api/cart` | Protected | Clear entire cart |

### Orders & Checkout (`/api/orders`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/orders` | Public / Protected | Create order & simulate payment gateway |
| `GET` | `/api/orders` | Protected | Get authenticated customer's orders |
| `GET` | `/api/orders/:id` | Protected | Order tracking & invoice details |
| `GET` | `/api/admin/orders` | Admin | View all platform orders |
| `PUT` | `/api/admin/orders/:id/status` | Admin | Update status (`pending`, `confirmed`, `shipped`, `delivered`, `cancelled`) |

### Inquiries & RFQs (`/api/inquiries`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/inquiries` | Public | Submit quotation request or technical inquiry |
| `GET` | `/api/admin/inquiries` | Admin | List all submitted quote requests |
| `PUT` | `/api/admin/inquiries/:id/status` | Admin | Update inquiry status & reply message |

### Admin Dashboard & Audit (`/api/admin`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/admin/users` | Admin | List all registered accounts + order counts |
| `GET` | `/api/admin/dashboard-stats` | Admin | Revenue, orders, users, low-stock count |
| `GET` | `/api/admin/dashboard` | Admin | Full dashboard payload (metrics + recent orders + low-stock feed) |
| `GET` | `/api/admin/activity-logs` | Admin | System audit trail of administrative actions |

---

## 💳 Payment Gateway Swapping Guide

The payment logic is cleanly decoupled into [services/paymentService.js](services/paymentService.js).

### To swap in Razorpay:
1. `npm install razorpay`
2. Add your keys in `.env`:
   ```env
   PAYMENT_GATEWAY_MODE=razorpay
   RAZORPAY_KEY_ID=rzp_live_xxxxxxxx
   RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxx
   ```
3. In `services/paymentService.js`, uncomment the Razorpay initialization block.

### To swap in Stripe:
1. `npm install stripe`
2. Add your keys in `.env`:
   ```env
   PAYMENT_GATEWAY_MODE=stripe
   STRIPE_SECRET_KEY=sk_live_xxxxxxxx
   STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxx
   ```
3. In `services/paymentService.js`, uncomment the Stripe payment intent creation block.
