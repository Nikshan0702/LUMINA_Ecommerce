# Cosmetics & Beauty Products E-Commerce Platform

A modern, responsive full-stack MERN (MongoDB, Express, React, Node.js) E-Commerce platform built for a cosmetics and beauty retailer. The application features a customer-facing storefront, an administrative management panel, PayHere Sandbox payment integration, direct WhatsApp ordering, inventory management, role-based authentication, and mobile-friendly responsive design.

---

## Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [System Architecture](#system-architecture)
- [Database Design](#database-design)
- [API Endpoints](#api-endpoints)
- [Authentication & Authorization](#authentication--authorization)
- [PayHere Sandbox Integration](#payhere-sandbox-integration)
- [WhatsApp Order Flow](#whatsapp-order-flow)
- [Setup Instructions](#setup-instructions)
- [Environment Variables](#environment-variables)
- [Running the Project](#running-the-project)
- [Deployment](#deployment)
- [Security Approach](#security-approach)
- [Assumptions](#assumptions)
- [Limitations](#limitations)

---

## Overview

This application was engineered for the Software Engineer Intern technical assessment. It satisfies a real-world business scenario for **"Lumina Cosmetics"**, an online cosmetics retailer selling botanical skincare, haircare, makeup, body care, and fragrances.

The project emphasizes simple, maintainable, readable junior/mid-level developer code without unnecessary abstractions or over-engineered design patterns, while adhering to robust security and data consistency standards.

---

## Features

### Customer Storefront
- **Storefront Home:** Hero presentation, curated beauty category explorer, bestsellers showcase, and promotional highlights.
- **Product Catalog:** Real-time search by product name/brand, category filter tabs (*Skincare, Haircare, Makeup, Body Care, Fragrance, Personal Care*), and price sorting.
- **Product Details:** High-resolution product showcase, category badges, stock level indicators, quantity selector, and live out-of-stock prevention.
- **Cart Management:** Persistent shopping cart (stored in `localStorage`), quantity adjustments capped by real-time inventory limits, item removal, and subtotal/delivery calculations.
- **Multi-Option Checkout:**
  1. **PayHere Online Payment:** Integrated PayHere Sandbox payment flow with cryptographically signed MD5 checksum hashes.
  2. **Direct WhatsApp Order:** Generates formatted multi-line order messages with line items, quantities, subtotal, delivery fee, and customer details, opening directly into WhatsApp.
- **Customer Order Tracking:** Review past orders, fulfillment status, and payment confirmation.

### Admin Management Panel
- **Protected Portal:** Restricted via JWT and role-based middleware (`role === 'admin'`). Non-admin customers are redirected away.
- **Admin Dashboard:** Real-time business metrics including Total Revenue, Total Orders, Pending Orders, Catalog Size, and Recent Transactions.
- **Catalog & Inventory CRUD:** Add new cosmetics, modify prices/descriptions, update inventory counts, toggle product visibility, and soft-delete/remove items.
- **Order Lifecycle Management:** Update order fulfillment statuses (*Pending, Confirmed, Processing, Shipped, Delivered, Cancelled*) and payment states (*Pending, Paid, Failed*). Automatically restores inventory stock if an order is cancelled.

---

## Tech Stack

### Frontend
- **React 18** (Vite build tool)
- **Tailwind CSS** (Clean, minimalist beauty-store palette)
- **React Router v6** (Declarative client routing & protected route wrappers)
- **Axios** (HTTP client with JWT request/response interceptors)
- **Lucide React** (Clean icons for UI clarity)

### Backend
- **Node.js & Express.js** (RESTful API architecture)
- **MongoDB & Mongoose** (Schema validation, object modeling)
- **JSON Web Tokens (JWT)** (Stateless bearer token authentication)
- **bcryptjs** (Salted password hashing)
- **dotenv & cors** (Configuration & Cross-Origin Resource Sharing)

---

## Project Structure

```text
TaskDartCode/
├── client/                     # Frontend Vite React Application
│   ├── public/
│   ├── src/
│   │   ├── components/         # Navbar, Footer, ProductCard, ProtectedRoute, AdminRoute, AdminNavbar
│   │   ├── context/            # AuthContext (user, login, logout) & CartContext (cart items, totals)
│   │   ├── pages/              # Home, Products, ProductDetail, Cart, Checkout, Login, Register, MyOrders
│   │   │   └── admin/          # AdminLogin, AdminDashboard, AdminProducts, AdminOrders
│   │   ├── services/           # Axios API instance with interceptors
│   │   ├── utils/              # Price and date formatters
│   │   ├── App.jsx             # Client router and route definitions
│   │   ├── index.css           # Tailwind base styles
│   │   └── main.jsx            # React root mount
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
├── server/                     # Backend Express REST API
│   ├── config/
│   │   └── db.js               # MongoDB connection logic
│   ├── controllers/
│   │   ├── authController.js   # User registration, login, profile
│   │   ├── productController.js# Product queries, search, filter, and admin CRUD
│   │   └── orderController.js  # Order creation, inventory deduction, PayHere hashes, status updates
│   ├── middleware/
│   │   ├── authMiddleware.js   # JWT verification & Admin role guard
│   │   └── errorMiddleware.js  # 404 & Centralized error handler
│   ├── models/
│   │   ├── User.js             # Customer & Admin user schema
│   │   ├── Product.js          # Cosmetics product schema
│   │   └── Order.js            # Customer order schema with embedded items
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── productRoutes.js
│   │   ├── orderRoutes.js
│   │   └── adminRoutes.js
│   ├── utils/
│   │   ├── generateToken.js    # JWT generator helper
│   │   ├── payhere.js          # PayHere MD5 checksum calculation
│   │   └── seedData.js         # Initial mock cosmetics catalog & demo accounts
│   ├── .env.example
│   ├── package.json
│   └── server.js               # Express application entry point
├── package.json                # Monorepo development scripts
├── .gitignore
└── README.md
```

---

## System Architecture

```text
       +-------------------------------------------------+
       |               React Client (Vite)               |
       |  (Tailwind CSS, React Router, Auth/Cart Context)|
       +-------------------------------------------------+
                         |             ^
           HTTP Requests |             | JSON Responses
                         v             |
       +-------------------------------------------------+
       |           Express Server (Node.js)              |
       |  - Auth Middleware (JWT Verification)           |
       |  - Admin Guard Middleware (Role Check)          |
       |  - PayHere MD5 Hash Generator                   |
       |  - Inventory & Stock Deduction Handler          |
       +-------------------------------------------------+
            |                                    |
            v                                    v
+-----------------------+           +-------------------------+
|     MongoDB Atlas     |           |     PayHere Sandbox     |
| (Users, Products,     |           | (Secure Payment Form /  |
|  Orders Collections)  |           |  IPN Verification)      |
+-----------------------+           +-------------------------+
```

---

## Database Design

### User Model (`User.js`)
- `name`: String (Required)
- `email`: String (Required, Unique, Lowercase)
- `password`: String (Required, Hashed with bcrypt)
- `phone`: String (Optional)
- `role`: String (Enum: `['customer', 'admin']`, Default: `'customer'`)
- `timestamps`: Created & Updated timestamps

### Product Model (`Product.js`)
- `name`: String (Required, Trimmed)
- `description`: String (Required)
- `category`: String (Enum: `['Skincare', 'Haircare', 'Makeup', 'Body Care', 'Fragrance', 'Personal Care']`)
- `brand`: String (Required)
- `price`: Number (Required, Min: 0)
- `image`: String (Required URL)
- `stock`: Number (Required, Min: 0, Default: 0)
- `isActive`: Boolean (Default: `true`)
- `timestamps`: Created & Updated timestamps

### Order Model (`Order.js`)
- `user`: ObjectId (Ref: `User`, Required)
- `items`: Array of embedded objects:
  - `product`: ObjectId (Ref: `Product`)
  - `name`: String
  - `price`: Number
  - `quantity`: Number (Min: 1)
  - `image`: String
- `subtotal`: Number (Required)
- `deliveryFee`: Number (Default: 500 LKR)
- `total`: Number (Required)
- `paymentMethod`: String (Enum: `['PayHere', 'WhatsApp']`)
- `paymentStatus`: String (Enum: `['Pending', 'Paid', 'Failed']`, Default: `'Pending'`)
- `orderStatus`: String (Enum: `['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled']`, Default: `'Pending'`)
- `customerName`: String (Required)
- `phone`: String (Required)
- `shippingAddress`: String (Required)
- `timestamps`: Created & Updated timestamps

---

## API Endpoints

### Authentication (`/api/auth`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Register new customer account |
| `POST` | `/api/auth/login` | Public | Authenticate user & receive JWT |
| `GET` | `/api/auth/me` | Protected | Retrieve authenticated user profile |

### Products (`/api/products`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/products` | Public | Get active products with `search`, `category`, `sort` |
| `GET` | `/api/products/:id` | Public | Get single product by ID |
| `GET` | `/api/products/admin/all` | Admin | Get all products (including inactive) |
| `POST` | `/api/products` | Admin | Create a new cosmetics product |
| `PUT` | `/api/products/:id` | Admin | Update product information, price, or stock |
| `DELETE` | `/api/products/:id` | Admin | Remove product from catalog |

### Orders & Checkout (`/api/orders`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/orders` | Customer | Place order, validate stock & deduct inventory |
| `GET` | `/api/orders/my-orders` | Customer | Retrieve current user's past orders |
| `GET` | `/api/orders/:id` | Protected | View single order detail |
| `GET` | `/api/orders/:id/payhere-params` | Customer | Generate PayHere checkout parameters and hash |
| `POST` | `/api/orders/:id/pay` | Customer | Mark order payment as Paid |
| `POST` | `/api/orders/payhere-notify` | Public | PayHere Instant Payment Notification (IPN) webhook |

### Admin Management (`/api/admin`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/admin/dashboard` | Admin | Fetch metrics (Total Products, Orders, Revenue) |
| `GET` | `/api/admin/orders` | Admin | View all orders across all customers |
| `PUT` | `/api/admin/orders/:id/status` | Admin | Update order status and payment status |

---

## Authentication & Authorization

- **JWT Tokens:** Issued upon login or registration containing `id` and `role`. Signed using `JWT_SECRET` and expires in 30 days.
- **Request Interceptor:** Client Axios instance reads `localStorage` and appends `Authorization: Bearer <token>` to requests.
- **Password Security:** Passwords hashed with 10 rounds of salted bcrypt before being persisted. Passwords are never returned in queries (`.select('-password')`).
- **Admin Protection:**
  - Route middleware `admin` strictly verifies `req.user.role === 'admin'`. Unauthorized requests receive `403 Forbidden`.
  - Frontend `AdminRoute` component redirects non-admin customers attempting to visit `/admin/*` back to the home page or login screen.

---

## PayHere Sandbox Integration

1. When a customer selects **PayHere Online Payment** during checkout, the order is first registered in the database with `paymentStatus: 'Pending'`.
2. The client requests the signed PayHere payload from `/api/orders/:id/payhere-params`.
3. The server calculates the standard PayHere hash using Node.js `crypto`:
   $$\text{Hash} = \text{MD5}(\text{merchant\_id} + \text{order\_id} + \text{amount} + \text{currency} + \text{MD5}(\text{merchant\_secret}).\text{toUpperCase()}).\text{toUpperCase()}$$
4. The client modal presents the sandbox parameters and allows simulated test confirmation.
5. Upon confirmation, the backend endpoint updates the order to `paymentStatus: 'Paid'` and `orderStatus: 'Confirmed'`.
6. A webhook receiver (`POST /api/orders/payhere-notify`) is also implemented to handle external PayHere IPN notifications.

---

## WhatsApp Order Flow

1. When a customer selects **Order via WhatsApp**, the order is saved in the database with `paymentMethod: 'WhatsApp'`.
2. The client builds the exact formatted text payload specified in the assessment requirements:
   ```text
   Hello, I would like to place an order.

   Customer:
   Name: Nimasha Perera
   Phone: 0771234567

   Order:
   1. Hydrating Hyaluronic Acid Serum - 2 x Rs. 3800
   2. Volumizing Biotin Hair Shampoo - 1 x Rs. 3500

   Subtotal: Rs. 11100
   Delivery: Rs. 500
   Total: Rs. 11600

   Address:
   No. 45, Flower Road, Colombo

   Order ID: 6702419a7e80d2efb4501b8a
   ```
3. The client opens WhatsApp via `https://wa.me/{WHATSAPP_NUMBER}?text={encodedMessage}`, pre-populating the chat with the retailer.
4. The cart is cleared and the customer is redirected to their order history.

---

## Setup Instructions

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- [MongoDB Atlas Account](https://www.mongodb.com/atlas) or local MongoDB instance

### 1. Clone & Install Dependencies
```bash
# Clone the repository
git clone <repository-url>
cd TaskDartCode

# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

---

## Environment Variables

Create a `.env` file in the `server/` directory:

```env
PORT=5001
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/cosmetics_store?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret_key_here
PAYHERE_MERCHANT_ID=1211149
PAYHERE_SECRET=4MTg5MzIyNDMyMzExOTUxNDk1MTIzNDU2
WHATSAPP_NUMBER=94771234567
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

*(A template is provided at `server/.env.example`)*

---

## Running the Project

### 1. Seed Initial Cosmetics Data
Populate the database with realistic cosmetics products (Skincare, Haircare, Makeup, etc.) and demo users:
```bash
cd server
npm run seed
```

#### Demo Login Accounts:
- **Admin Account:** `admin@lumina.com` / `adminpassword123`
- **Customer Account:** `customer@example.com` / `customerpassword123`
*(Note: A one-click "Quick-Fill" button is provided on the Sign In page for interview evaluation).*

### 2. Start the Backend API
```bash
cd server
npm run dev
# Server runs on http://localhost:5001
```

### 3. Start the Frontend Application
```bash
cd client
npm run dev
# Vite runs on http://localhost:5173
```

---

## Deployment

### Frontend (Vercel)
1. Link the repository to Vercel and set the Root Directory to `client`.
2. Framework Preset: **Vite**.
3. Build Command: `npm run build`, Output Directory: `dist`.
4. Configure environment variable for production API endpoint if decoupled.

### Backend (Render / Railway)
1. Deploy a new Web Service pointing to the repository, setting Root Directory to `server`.
2. Build Command: `npm install`, Start Command: `node server.js`.
3. Provide environment variables in the dashboard: `MONGO_URI`, `JWT_SECRET`, `PAYHERE_MERCHANT_ID`, `PAYHERE_SECRET`, `WHATSAPP_NUMBER`, `FRONTEND_URL`.

### Database (MongoDB Atlas)
1. Deploy an M0 free tier cluster on MongoDB Atlas.
2. In Network Access, whitelist `0.0.0.0/0` (or host IP).
3. Copy the connection string into `MONGO_URI`.

---

## Security Approach

1. **Password Hashing:** Passwords hashed with bcrypt; raw passwords never saved or logged.
2. **JWT Authorization:** Stateless Bearer tokens verified on protected customer and admin routes.
3. **Price & Stock Integrity:** Order totals and line prices are re-queried and computed from the database on the backend to prevent frontend parameter tampering.
4. **Environment Variables:** All secrets, payment keys, and database credentials are kept out of source code.
5. **CORS & Input Validation:** Strict input validation on registration, order structures, stock quantities, and MongoDB ObjectIds.
6. **No Leaked Errors:** Production error responses do not leak database stack traces to the client.

---

## Assumptions

1. Delivery fee is set to a flat **Rs. 500** for all orders across Sri Lanka.
2. The store currency is **LKR (Sri Lankan Rupees)**.
3. WhatsApp ordering relies on the customer's device having access to WhatsApp Web or the WhatsApp mobile app.
4. PayHere Sandbox merchant credentials use standard testing keys provided in PayHere development documentation.

---

## Limitations

1. **PayHere Live Payments:** Configured exclusively for sandbox mode; requires merchant verification for live production transactions.
2. **Single Currency:** Transactions are calculated in LKR.
3. **SMS Notifications:** Notifications are delivered through the in-app order tracker and WhatsApp chat rather than third-party SMS gateways.
