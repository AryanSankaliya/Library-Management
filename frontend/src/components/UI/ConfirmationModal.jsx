import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Check, X, HelpCircle } from "lucide-react";
import AnimatedButton from "./AnimatedButton";

const ConfirmationModal = ({
    isOpen,
    title,
    message,
    onConfirm,
    onCancel,
    confirmText = "Confirm",
    cancelText = "Cancel",
    type = "danger" // danger, info, success
}) => {

    // Icon mapping
    const icons = {
        danger: <AlertTriangle className="text-red-500" size={32} />,
        info: <HelpCircle className="text-blue-500" size={32} />,
        success: <Check className="text-green-500" size={32} />
    };

    // Color mapping
    const colors = {
        danger: {
            bg: "bg-red-50",
            border: "border-red-100",
            btn: "text-red-600 hover:bg-red-50 border-red-200"
        },
        info: {
            bg: "bg-blue-50",
            border: "border-blue-100",
            btn: "text-blue-600 hover:bg-blue-50 border-blue-200"
        },
        success: {
            bg: "bg-green-50",
            border: "border-green-100",
            btn: "text-green-600 hover:bg-green-50 border-green-200"
        }
    };

    const currentStyle = colors[type];

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onCancel}
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
                    >
                        {/* Modal */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                            className="w-full max-w-md bg-white/90 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl overflow-hidden"
                        >
                            <div className={`p-6 flex flex-col items-center text-center ${currentStyle.bg} border-b ${currentStyle.border}`}>
                                <div className="p-3 bg-white rounded-full shadow-sm mb-4">
                                    {icons[type]}
                                </div>
                                <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
                                <p className="text-gray-600 text-sm leading-relaxed">
                                    {message}
                                </p>
                            </div>

                            <div className="p-4 flex gap-3 bg-white/50">
                                <AnimatedButton
                                    onClick={onCancel}
                                    variant="secondary"
                                    className="flex-1 border-gray-200 hover:bg-gray-50 text-gray-600"
                                >
                                    {cancelText}
                                </AnimatedButton>
                                <AnimatedButton
                                    onClick={onConfirm}
                                    className={`flex-1 ${currentStyle.btn} border bg-white`}
                                >
                                    {confirmText}
                                </AnimatedButton>
                            </div>
                        </motion.div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default ConfirmationModal;
