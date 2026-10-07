# Lumina Cosmetics & Beauty Store

A full-stack, responsive E-Commerce web application designed and developed for the **Software Engineer Intern** technical assessment.

This project represents a realistic cosmetics and beauty retail platform (**Lumina Cosmetics**) selling skincare, haircare, makeup, body care, and fragrances. It features a complete customer storefront, a back-office Admin Panel, persistent MongoDB storage, PayHere online payments, and direct WhatsApp order flow.

---

## Live Links & Submission Details

- **Live Storefront (Frontend)**: [https://lumina-indol-tau.vercel.app](https://lumina-indol-tau.vercel.app)
- **Live Backend API**: [https://lumina-ecommerce-gmqq.onrender.com](https://lumina-ecommerce-gmqq.onrender.com)
- **API Health Check**: [https://lumina-ecommerce-gmqq.onrender.com/api/health](https://lumina-ecommerce-gmqq.onrender.com/api/health)
- **GitHub Repository**: [https://github.com/Nikshan0702/LUMINA_Ecommerce](https://github.com/Nikshan0702/LUMINA_Ecommerce)
- **Store Owner WhatsApp**: `+94771129911`

---

## Demo Accounts for Evaluation

Quick-fill demo buttons are provided on the Sign-In page for 1-click evaluation:

| Role | Email | Password | Access Rights |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@lumina.com` | `adminpassword123` | Full Admin Panel (`/admin/dashboard`, `/admin/products`, `/admin/orders`) |
| **Customer** | `customer@example.com` | `customerpassword123` | Storefront Shopping, Bag, Checkout, Order Tracking |

---

## Core Features

### 1. Customer Storefront
- **Product Browsing & Filtering**: Clean catalog view with search by name/brand, category filtering (*Skincare, Haircare, Makeup, Body Care, Fragrance*), and price sorting.
- **Product Details**: Product specifications, live stock status, and dynamic quantity selector.
- **Guest Shopping Bag**: Customers can add items to bag without logging in. Real-time stock boundaries prevent exceeding available inventory.
- **Dual Checkout Options**:
  - **PayHere Online Payment**: Secure online card gateway flow using standard PayHere Sandbox MD5 checksum validation.
  - **Order via WhatsApp**: Automatically formats the entire shopping bag and delivery details into a clean message and opens WhatsApp chat with the store owner (`+94771129911`).
- **Customer Order Tracking**: Real-time view of order history, fulfillment progress, and payment status at `/my-orders`.

### 2. Admin Management Panel
- **Protected Back-Office**: Role-based access control (RBAC) restricts admin routes to authenticated admin users only.
- **Store Dashboard**: KPI metrics for Total Revenue, Total Orders, Pending Dispatches, Catalog Count, and Recent Transactions.
- **Inventory & Catalog Management**: Add new products, update prices and stock levels, toggle active visibility, and delete products.
- **Order Lifecycle Management**: Update fulfillment status (*Pending → Confirmed → Shipped → Delivered → Cancelled*) and payment status (*Pending ↔ Paid*).
- **Auto Stock Restoration**: Cancelling an order automatically restores the purchased quantities back to inventory stock.

---

## Technologies Used

- **Frontend**: React 18, Vite, Tailwind CSS, Plus Jakarta Sans typography, Lucide Icons, Axios.
- **Backend**: Node.js, Express.js (RESTful API architecture).
- **Database**: MongoDB Atlas with Mongoose ODM.
- **Authentication**: JWT (JSON Web Tokens) with 30-day validity, bcryptjs password hashing.
- **Payment & Integration**: PayHere Sandbox (crypto MD5 checksum formula), WhatsApp Click-to-Chat API.
- **Hosting & Deployment**: Vercel (Frontend SPA) + Render (Backend Web Service) + MongoDB Atlas (Cloud Database).

---

## Project Structure

```text
TaskDartCode/
├── client/                     # Frontend (React 18 + Vite)
│   ├── public/                 # Static assets, favicon, logo, _redirects (SPA routing)
│   ├── src/
│   │   ├── components/         # Navbar, Footer, ProductCard, AdminNavbar, ProtectedRoute
│   │   ├── context/            # AuthContext (user state) & CartContext (shopping bag)
│   │   ├── pages/              # Home, Products, ProductDetail, Cart, Checkout, MyOrders, Login
│   │   │   └── admin/          # AdminDashboard, AdminProducts, AdminOrders, AdminLogin
│   │   ├── services/           # api.js (Axios instance with JWT interceptors)
│   │   └── utils/              # formatters.js (currency, dates, order codes)
│   ├── vercel.json             # Vercel SPA routing fallback rule
│   └── tailwind.config.js      # Palette and typography theme
│
└── server/                     # Backend (Node.js + Express + MongoDB)
    ├── config/                 # db.js (Mongoose connection)
    ├── controllers/            # authController, productController, orderController, adminController
    ├── middleware/             # authMiddleware (JWT & admin guard), errorMiddleware
    ├── models/                 # User.js, Product.js, Order.js
    ├── routes/                 # authRoutes, productRoutes, orderRoutes, adminRoutes
    ├── utils/                  # payhere.js (MD5 hash), seedData.js (demo catalog)
    └── server.js               # Application entry point
```

---

## Database Design

### 1. `User` Model
- `name` (String, required)
- `email` (String, required, unique, indexed)
- `password` (String, required, bcrypt hashed)
- `role` (String, enum: `['customer', 'admin']`, default: `'customer'`)
- `phone` (String)

### 2. `Product` Model
- `name` (String, required)
- `description` (String, required)
- `category` (String, required, indexed)
- `brand` (String, required)
- `price` (Number, required)
- `image` (String, required)
- `stock` (Number, required, default: 0)
- `isActive` (Boolean, default: true)

### 3. `Order` Model
- `user` (ObjectId ref User, required)
- `customerName`, `email`, `phone`, `shippingAddress`, `city` (Strings)
- `items`: Array of `{ product: ObjectId, name: String, price: Number, quantity: Number, image: String }`
- `subtotal` (Number), `deliveryFee` (Number, default: 500), `total` (Number)
- `paymentMethod` (enum: `['PayHere', 'WhatsApp']`)
- `paymentStatus` (enum: `['Pending', 'Paid', 'Failed']`)
- `orderStatus` (enum: `['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled']`)

---

## Important Technical & Security Decisions

1. **Server-Side Price Verification**:
   The frontend never dictates line-item prices. When an order is created, the backend re-queries each product's price from MongoDB to compute the total, preventing client price manipulation.
2. **Real-Time Inventory Integrity**:
   Placing an order decrements stock atomically. If an admin marks an order as `Cancelled`, stock is automatically incremented back to the catalog.
3. **PayHere Hash Generation**:
   The server generates the required MD5 checksum using `crypto.createHash('md5')` matching the official formula:
   `MD5(merchant_id + order_id + amount + currency + MD5(merchant_secret))`
4. **Structured WhatsApp Order Format**:
   The WhatsApp ordering flow generates a readable, itemized message pre-filled with customer details, quantities, subtotal, delivery fee, and a clean human-readable order code (`#ORD-XXXXXX`).
5. **Role-Based Access Control (RBAC)**:
   Sensitive administrative endpoints are strictly guarded by JWT verification and role checks (`adminMiddleware`). Non-admin users are blocked with 403 Forbidden.
6. **Clean E-Commerce Identifier Format**:
   Internal 24-character MongoDB ObjectIds are abstracted into professional order codes (`#ORD-XXXXXX`) across all customer and admin screens.

---

## Local Setup Instructions

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas connection string (or local MongoDB)

### 1. Clone the Repository
```bash
git clone https://github.com/Nikshan0702/LUMINA_Ecommerce.git
cd LUMINA_Ecommerce
```

### 2. Backend Setup
```bash
cd server
npm install
```

Create a `.env` file in the `server` folder:
```env
PORT=5001
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
PAYHERE_MERCHANT_ID=1211149
PAYHERE_SECRET=your_payhere_secret
WHATSAPP_NUMBER=94771129911
NODE_ENV=development
```

Seed initial cosmetics catalog and demo users:
```bash
npm run seed
```

Start the backend:
```bash
npm run dev
# Server running on http://localhost:5001
```

### 3. Frontend Setup
```bash
cd ../client
npm install
npm run dev
# Vite running on http://localhost:5173
```

---

## Assumptions & Limitations

- **Currency**: Transactions and pricing are in Sri Lankan Rupees (LKR).
- **Delivery**: Flat island-wide delivery fee of Rs. 500 is applied.
- **PayHere**: Configured using standard PayHere Sandbox test merchant credentials.
- **WhatsApp**: Requires the customer's device to have WhatsApp or WhatsApp Web available.
