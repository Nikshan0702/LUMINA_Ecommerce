import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    try {
      const savedCart = localStorage.getItem('lumina_cart');
      return savedCart ? JSON.parse(savedCart) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('lumina_cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product, quantity = 1) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.product === product._id);

      if (existingItem) {
        // Enforce stock limit
        const newQuantity = Math.min(existingItem.quantity + quantity, product.stock);
        return prevCart.map((item) =>
          item.product === product._id ? { ...item, quantity: newQuantity } : item
        );
      } else {
        const itemQuantity = Math.min(quantity, product.stock);
        if (itemQuantity <= 0) return prevCart;
        return [
          ...prevCart,
          {
            product: product._id,
            name: product.name,
            price: product.price,
            image: product.image,
            brand: product.brand,
            stock: product.stock,
            quantity: itemQuantity
          }
        ];
      }
    });
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCart((prevCart) =>
      prevCart.map((item) => {
        if (item.product === productId) {
          const validQuantity = Math.min(newQuantity, item.stock);
          return { ...item, quantity: validQuantity };
        }
        return item;
      })
    );
  };

  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.product !== productId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = cart.length > 0 ? 500 : 0;
  const total = subtotal + deliveryFee;
  const totalItemsCount = cart.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        subtotal,
        deliveryFee,
        total,
        totalItemsCount
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
