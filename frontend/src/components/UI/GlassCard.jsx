import { motion } from "framer-motion";

const GlassCard = ({ children, className = "", hoverEffect = true, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: delay }}
      whileHover={hoverEffect ? { scale: 1.02, boxShadow: "0px 10px 30px rgba(0,0,0,0.1)" } : {}}
      className={`backdrop-blur-md bg-white/30 border border-white/20 rounded-2xl shadow-lg p-6 ${className}`}
    >
      {children}
    </motion.div>
  );
};

export default GlassCard;
