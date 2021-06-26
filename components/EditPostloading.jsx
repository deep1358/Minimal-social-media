import { motion } from "framer-motion";

const EditPostLoading = () => {
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
    <div className="loading-div">
      <motion.div
        variants={loaderVariants}
        animate="animation"
        className="ball"
      ></motion.div>
      <h1>Updating...</h1>
    </div>
  );
};

export default EditPostLoading;
