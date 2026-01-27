import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { sendOtp, resetPasswordApi } from "../api/userApi";
import GlassCard from "../components/UI/GlassCard";
import AnimatedButton from "../components/UI/AnimatedButton";
import Input from "../components/UI/Input";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, Key, ArrowLeft, Send } from "lucide-react";
import { useToast } from "../context/ToastContext";

export default function ForgotPassword() {
    const navigate = useNavigate();
    const { showToast } = useToast();

    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");

    const handleSendOtp = async (e) => {
        e.preventDefault();

        // Email Validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
        if (!emailRegex.test(email)) {
            showToast("Please enter a valid email.", "error");
            return;
        }

        setLoading(true);
        try {
            await sendOtp(email);
            showToast("OTP sent to your email!", "success");
            setStep(2);
        } catch (err) {
            showToast(err.response?.data?.message || "Failed to send OTP", "error");
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await resetPasswordApi(email, otp, newPassword);
            showToast("Password reset successfully! Login now.", "success");
            navigate("/login");
        } catch (err) {
            showToast(err.response?.data?.message || "Reset failed", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full flex items-center justify-center">
            <GlassCard className="w-full max-w-md p-8 relative overflow-hidden" hoverEffect={false}>

                {/* Header Animation */}
                <motion.div
                    layout
                    className="text-center mb-8"
                >
                    <motion.div
                        className="mx-auto w-16 h-16 bg-gradient-to-tr from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white mb-4 shadow-lg shadow-purple-500/30"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200, damping: 15 }}
                    >
                        {step === 1 ? <Mail size={32} /> : <Key size={32} />}
                    </motion.div>
                    <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-purple-700">
                        {step === 1 ? "Forgot Password?" : "Reset Password"}
                    </h2>
                    <p className="text-gray-500 mt-2 text-sm">
                        {step === 1
                            ? "Enter your email to receive a recovery code."
                            : "Enter the code sent to your email."}
                    </p>
                </motion.div>

                <AnimatePresence mode="wait">
                    {step === 1 ? (
                        <motion.form
                            key="step1"
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 50 }}
                            onSubmit={handleSendOtp}
                            className="space-y-6"
                        >
                            <Input
                                label="Email Address"
                                type="email"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value.toLowerCase())}
                                required
                                className="bg-white/50"
                            />

                            <AnimatedButton
                                type="submit"
                                disabled={loading}
                                className="w-full py-3 text-lg flex items-center justify-center gap-2"
                            >
                                {loading ? "Sending..." : <>Send OTP <Send size={18} /></>}
                            </AnimatedButton>
                        </motion.form>
                    ) : (
                        <motion.form
                            key="step2"
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                            onSubmit={handleResetPassword}
                            className="space-y-6"
                        >
                            <div className="bg-blue-50 p-3 rounded-lg flex items-center gap-3 border border-blue-100">
                                <div className="bg-blue-100 p-2 rounded-full text-blue-600">
                                    <Mail size={16} />
                                </div>
                                <div className="flex-1 overflow-hidden">
                                    <p className="text-xs text-blue-500 uppercase font-bold tracking-wider">Sent to</p>
                                    <p className="text-sm font-medium text-blue-800 truncate">{email}</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setStep(1)}
                                    className="text-xs text-blue-600 hover:text-blue-800 font-semibold underine"
                                >
                                    Change
                                </button>
                            </div>

                            <Input
                                label="OTP Code"
                                type="text"
                                placeholder="123456"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                required
                                className="bg-white/50 tracking-widest text-center font-mono text-lg"
                                maxLength={6}
                            />

                            <Input
                                label="New Password"
                                type="password"
                                placeholder="••••••••"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                                className="bg-white/50"
                            />

                            <AnimatedButton
                                type="submit"
                                disabled={loading}
                                className="w-full py-3 text-lg"
                            >
                                {loading ? "Resetting..." : "Set New Password"}
                            </AnimatedButton>
                        </motion.form>
                    )}
                </AnimatePresence>

                <div className="mt-8 pt-6 border-t border-gray-100 text-center">
                    <button
                        onClick={() => navigate("/login")}
                        className="text-gray-500 hover:text-gray-800 flex items-center justify-center gap-2 text-sm font-medium transition-colors mx-auto"
                    >
                        <ArrowLeft size={16} /> Back to Login
                    </button>
                </div>

            </GlassCard>
        </div>
    );
}
