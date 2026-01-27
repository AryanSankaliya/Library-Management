import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../api/userApi";
import GlassCard from "../components/UI/GlassCard";
import AnimatedButton from "../components/UI/AnimatedButton";
import Input from "../components/UI/Input";
import { motion } from "framer-motion";
import { LogIn } from "lucide-react";
import { useToast } from "../context/ToastContext";

export default function Login() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const { showToast } = useToast();

    const handleLogin = async (e) => {
        e.preventDefault();

        // Email Validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
        if (!emailRegex.test(email)) {
            showToast("Invalid email format.", "error");
            return;
        }

        setLoading(true);

        try {
            const res = await loginUser(email, password);
            localStorage.setItem("token", res.data.token);
            localStorage.setItem("role", res.data.role);
            localStorage.setItem("email", res.data.email);

            showToast("Magic. You're in.", "success");

            if (res.data.role === 'admin') {
                navigate("/");
            } else {
                navigate("/books");
            }
        } catch (err) {
            showToast("Hiccup detected. Let's try that again.", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full flex items-center justify-center">
            <GlassCard className="w-full max-w-md p-8" hoverEffect={false}>
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-center mb-8"
                >
                    <div className="mx-auto w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white mb-4 shadow-lg shadow-blue-500/50">
                        <LogIn size={32} />
                    </div>
                    <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-indigo-700">
                        Welcome Back
                    </h2>
                    <p className="text-gray-500 mt-2">Sign in to access your library</p>
                </motion.div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <Input
                        label="Email Address"
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value.toLowerCase())}
                        required
                        className="bg-white/50"
                    />

                    <Input
                        label="Password"
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="bg-white/50"
                    />

                    <div className="flex justify-end -mt-4 mb-2">
                        <Link
                            to="/forgot-password"
                            reloadDocument
                            className="text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors"
                        >
                            Forgot Password?
                        </Link>
                    </div>

                    <AnimatedButton
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 text-lg"
                    >
                        {loading ? (
                            <motion.span
                                animate={{ opacity: [0.5, 1, 0.5] }}
                                transition={{ repeat: Infinity, duration: 1 }}
                            >
                                Logging in...
                            </motion.span>
                        ) : (
                            "Sign In"
                        )}
                    </AnimatedButton>

                    <p className="text-center text-sm text-gray-600 mt-6">
                        Don't have an account?{" "}
                        <span
                            onClick={() => navigate("/register")}
                            className="text-blue-600 font-semibold cursor-pointer hover:underline"
                        >
                            Create Account
                        </span>
                    </p>
                </form>
            </GlassCard>
        </div>
    );
}