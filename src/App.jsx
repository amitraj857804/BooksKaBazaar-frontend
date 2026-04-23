import { useState } from "react";
import { motion } from "framer-motion";
import reactLogo from "./assets/react.svg";
import viteLogo from "./assets/vite.svg";
import heroImg from "./assets/hero.png";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.2,
      },
    },
  };

  const titleVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  const subtitleVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  return (
    <>
      <div className="app-container">
        <motion.div
          className="content-wrapper"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h1
            className="app-title"
            variants={titleVariants}
            whileHover={{ scale: 1.05, rotateY: 10 }}
            transition={{ type: "spring", stiffness: 300, damping: 10 }}
          >
            Books Ka Bazaar
          </motion.h1>
          <motion.h3
            className="app-subtitle"
            variants={subtitleVariants}
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300, damping: 10 }}
          >
            Coming soon....
          </motion.h3>
        </motion.div>
      </div>
    </>
  );
}

export default App;
