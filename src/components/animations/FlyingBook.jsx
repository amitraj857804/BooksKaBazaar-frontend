import { motion } from "framer-motion";
import { useFlyToCartContext } from "../../context/FlyToCartContext";

const FlyingBook = () => {
  const { isFlying, flyingBook, cartIconRef } = useFlyToCartContext();

  if (!isFlying || !flyingBook) return null;

  const startPosition = flyingBook.startPosition;
  const cartIconRect = cartIconRef.current?.getBoundingClientRect();

  // Calculate end position (cart icon center)
  const endPosition = cartIconRect
    ? {
        x: cartIconRect.left + cartIconRect.width / 2,
        y: cartIconRect.top + cartIconRect.height / 2,
      }
    : { x: window.innerWidth - 40, y: 20 };

  // Calculate delta for animation
  const deltaX = endPosition.x - startPosition.x;
  const deltaY = endPosition.y - startPosition.y;

  // Arc trajectory (quadratic bezier approximation)
  const midX = startPosition.x + deltaX / 2;
  const midY = startPosition.y + deltaY / 2 - 100; // Arc upward

  return (
    <motion.div
      className="fixed pointer-events-none"
      style={{
        left: startPosition.x,
        top: startPosition.y,
        zIndex: 9999,
      }}
      initial={{
        x: 0,
        y: 0,
        scale: 1,
        opacity: 1,
      }}
      animate={{
        x: deltaX,
        y: deltaY,
        scale: 0,
        opacity: 0,
      }}
      transition={{
        duration: 0.8,
        ease: "backIn",
        type: "tween",
      }}
    >
      <motion.img
        src={flyingBook.book.imageURL}
        alt="Flying book"
        className="w-12 h-16 object-cover rounded shadow-lg"
        initial={{ rotate: 0 }}
        animate={{ rotate: -10 }}
        transition={{ duration: 0.8 }}
      />
    </motion.div>
  );
};

export default FlyingBook;
