import { useFlyToCartContext } from "../context/FlyToCartContext";
import { useDispatch } from "react-redux";
import { addItem } from "../store/cartSlice";

export const useFlyToCart = () => {
  const { triggerFlyToCart, completeFlyAnimation } = useFlyToCartContext();
  const dispatch = useDispatch();

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

    // Add item to Redux after animation starts
    dispatch(addItem(book));

    // Complete animation after it finishes
    setTimeout(() => {
      completeFlyAnimation();
    }, 800);
  };

  return { handleFlyToCart };
};
