import { motion } from "framer-motion";

const AnimatedButton = ({
    children,
    onClick,
    variant = "primary",
    className = "",
    disabled = false,
    type = "button"
}) => {
    const baseStyles = "px-6 py-2 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2";

    const variants = {
        primary: "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg hover:shadow-blue-500/30",
        secondary: "bg-white/50 text-gray-800 border border-white/20 hover:bg-white/80",
        danger: "bg-gradient-to-r from-red-500 to-rose-600 text-white shadow-lg hover:shadow-red-500/30",
        success: "bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg hover:shadow-emerald-500/30",
        ghost: "bg-transparent text-gray-600 hover:bg-gray-100/50"
    };

    return (
        <motion.button
            type={type}
            onClick={onClick}
            disabled={disabled}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`${baseStyles} ${variants[variant] || variants.primary} ${disabled ? "opacity-50 cursor-not-allowed grayscale" : ""} ${className}`}
        >
            {children}
        </motion.button>
    );
};

export default AnimatedButton;
