import { motion } from "framer-motion";

const Input = ({ label, type = "text", name, value, onChange, placeholder, required = false, className = "" }) => {
    return (
        <div className={`mb-4 ${className}`}>
            {label && <label className="block text-gray-700 font-medium mb-1 ml-1">{label}</label>}
            <motion.input
                whileFocus={{ scale: 1.01, borderColor: "#4F46E5", boxShadow: "0px 0px 8px rgba(79, 70, 229, 0.2)" }}
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                required={required}
                className="w-full bg-white/50 border border-gray-300 rounded-xl px-4 py-3 outline-none transition-all duration-300 backdrop-blur-sm focus:bg-white"
            />
        </div>
    );
};

export default Input;
