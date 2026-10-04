import { useFlyToCartContext } from "../context/FlyToCartContext";

export const useFlyToCart = () => {
  const { triggerFlyToCart, completeFlyAnimation } = useFlyToCartContext();

  const handleFlyToCart = (book, buttonElement) => {
    if (!buttonElement || !book) return;

    // Get button position
    const buttonRect = buttonElement.getBoundingClientRect();
    const startPosition = {
      x: buttonRect.left + buttonRect.width / 2,
      y: buttonRect.top + buttonRect.height / 2,
    };

    // Trigger the flying animation
    triggerFlyToCart(book, startPosition);

    // Complete animation after it finishes
    setTimeout(() => {
      completeFlyAnimation();
    }, 800);
  };

  return { handleFlyToCart };
};
