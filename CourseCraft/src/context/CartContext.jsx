import React, { createContext, useState, useEffect } from "react";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (course) => {
    const existingItem = cart.find((item) => item._id === course._id);
    
    if (existingItem) {
      // If course already in cart, just update quantity
      setCart(
        cart.map((item) =>
          item._id === course._id
            ? { ...item, quantity: (item.quantity || 1) + 1 }
            : item
        )
      );
    } else {
      // Add new course to cart with quantity 1
      setCart([...cart, { ...course, quantity: 1 }]);
    }
  };

  const removeFromCart = (courseId) => {
    setCart(cart.filter((item) => item._id !== courseId));
  };

  const updateQuantity = (courseId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(courseId);
    } else {
      setCart(
        cart.map((item) =>
          item._id === courseId ? { ...item, quantity } : item
        )
      );
    }
  };

  const clearCart = () => {
    setCart([]);
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => {
      const price = item.discountPrice || item.price;
      return total + price * (item.quantity || 1);
    }, 0);
  };

  const getOriginalTotal = () => {
    return cart.reduce((total, item) => {
      return total + item.price * (item.quantity || 1);
    }, 0);
  };

  const getTotalDiscount = () => {
    return getOriginalTotal() - getCartTotal();
  };

  const cartItemCount = cart.length;

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getOriginalTotal,
        getTotalDiscount,
        cartItemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
