import { createContext, useContext, useState, useRef } from "react";

const FlyToCartContext = createContext();

export const FlyToCartProvider = ({ children }) => {
  const [isFlying, setIsFlying] = useState(false);
  const [flyingBook, setFlyingBook] = useState(null);
  const cartIconRef = useRef(null);

  const triggerFlyToCart = (book, startPosition) => {
    setFlyingBook({
      book,
      startPosition,
      timestamp: Date.now(),
    });
    setIsFlying(true);
  };

  const completeFlyAnimation = () => {
    setIsFlying(false);
    setFlyingBook(null);
  };

  return (
    <FlyToCartContext.Provider
      value={{
        isFlying,
        flyingBook,
        cartIconRef,
        triggerFlyToCart,
        completeFlyAnimation,
      }}
    >
      {children}
    </FlyToCartContext.Provider>
  );
};

export const useFlyToCartContext = () => {
  const context = useContext(FlyToCartContext);
  if (!context) {
    throw new Error("useFlyToCartContext must be used within FlyToCartProvider");
  }
  return context;
};
