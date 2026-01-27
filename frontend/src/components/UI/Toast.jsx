import { motion } from "framer-motion";
import { CheckCircle, XCircle, AlertTriangle, Info, X } from "lucide-react";

// Icon mapping based on type
const icons = {
    success: <CheckCircle className="text-green-500" size={20} />,
    error: <XCircle className="text-red-500" size={20} />,
    warning: <AlertTriangle className="text-amber-500" size={20} />,
    info: <Info className="text-blue-500" size={20} />,
};

// Styles mapping for borders/glows
const styles = {
    success: "border-green-500/30 bg-green-50/80 shadow-green-500/10",
    error: "border-red-500/30 bg-red-50/80 shadow-red-500/10",
    warning: "border-amber-500/30 bg-amber-50/80 shadow-amber-500/10",
    info: "border-blue-500/30 bg-blue-50/80 shadow-blue-500/10",
};

const Toast = ({ id, message, type = "success", onClose }) => {
    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className={`pointer-events-auto relative flex items-center gap-3 min-w-[300px] max-w-sm px-4 py-3 rounded-2xl border backdrop-blur-md shadow-lg ${styles[type]}`}
        >
            <div className="shrink-0">{icons[type]}</div>
            <p className="text-sm font-medium text-gray-700 flex-1 leading-snug">
                {message}
            </p>
            <button
                onClick={onClose}
                className="shrink-0 p-1 rounded-full hover:bg-gray-200/50 text-gray-400 hover:text-gray-600 transition-colors"
            >
                <X size={16} />
            </button>
        </motion.div>
    );
};

export default Toast;
