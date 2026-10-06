import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

// Components & Layouts
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';

// Customer Pages
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import Register from './pages/Register';
import MyOrders from './pages/MyOrders';

// Admin Pages
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminOrders from './pages/admin/AdminOrders';

// Layout wrapper for customer-facing views
const CustomerLayout = ({ children }) => (
  <div className="min-h-screen flex flex-col bg-slate-50">
    <Navbar />
    <main className="flex-1">{children}</main>
    <Footer />
  </div>
);

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <Routes>
            {/* Customer Facing Routes */}
            <Route
              path="/"
              element={
                <CustomerLayout>
                  <Home />
                </CustomerLayout>
              }
            />
            <Route
              path="/products"
              element={
                <CustomerLayout>
                  <Products />
                </CustomerLayout>
              }
            />
            <Route
              path="/products/:id"
              element={
                <CustomerLayout>
                  <ProductDetail />
                </CustomerLayout>
              }
            />
            <Route
              path="/cart"
              element={
                <CustomerLayout>
                  <Cart />
                </CustomerLayout>
              }
            />
            <Route
              path="/checkout"
              element={
                <ProtectedRoute>
                  <CustomerLayout>
                    <Checkout />
                  </CustomerLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/login"
              element={
                <CustomerLayout>
                  <Login />
                </CustomerLayout>
              }
            />
            <Route
              path="/register"
              element={
                <CustomerLayout>
                  <Register />
                </CustomerLayout>
              }
            />
            <Route
              path="/my-orders"
              element={
                <ProtectedRoute>
                  <CustomerLayout>
                    <MyOrders />
                  </CustomerLayout>
                </ProtectedRoute>
              }
            />

            {/* Admin Portal Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route
              path="/admin/dashboard"
              element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/products"
              element={
                <AdminRoute>
                  <AdminProducts />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/orders"
              element={
                <AdminRoute>
                  <AdminOrders />
                </AdminRoute>
              }
            />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
