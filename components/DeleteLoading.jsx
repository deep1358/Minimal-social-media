import { motion } from "framer-motion";

const DeleteLoading = () => {
  const loaderVariants = {
    animation: {
      x: [-20, 20],
      y: [0, -30],
      transition: {
        x: {
          yoyo: Infinity,
          duration: 0.5,
        },
        y: {
          yoyo: Infinity,
          duration: 0.25,
          ease: "easeOut",
        },
      },
    },
  };

  return (
    <div className="delete-loading">
      <motion.div
        variants={loaderVariants}
        animate="animation"
        className="delete-ball"
      ></motion.div>
      <h1>Deleting...</h1>
    </div>
  );
};

export default DeleteLoading;
