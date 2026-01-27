import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../api/userApi";
import GlassCard from "../components/UI/GlassCard";
import AnimatedButton from "../components/UI/AnimatedButton";
import Input from "../components/UI/Input";
import { motion } from "framer-motion";
import { UserPlus, Shield } from "lucide-react";
import { useToast } from "../context/ToastContext";

export default function Register() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        role: "user",
    });
    const [loading, setLoading] = useState(false);

    const { showToast } = useToast();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Email Validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
        if (!emailRegex.test(formData.email)) {
            showToast("Invalid email format.", "error");
            return;
        }

        setLoading(true);

        try {
            const res = await registerUser(formData);
            showToast("Boom. Account created.", "success");
            navigate("/login");
        } catch (err) {
            showToast("Not ideal. Double-check those details.", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full flex items-center justify-center">
            <GlassCard className="w-full max-w-md p-5" hoverEffect={false}>
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-center mb-3"
                >
                    <div className="mx-auto w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white mb-2 shadow-lg shadow-blue-500/50">
                        <UserPlus size={20} />
                    </div>
                    <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-indigo-700">
                        Create Account
                    </h2>
                    <p className="text-gray-500 text-sm mt-1">Join our library community today</p>
                </motion.div>

                <form onSubmit={handleSubmit} className="space-y-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <Input
                            label="Full Name"
                            name="name"
                            type="text"
                            placeholder="John Doe"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="bg-white/50 !mb-0"
                        />

                        <Input
                            label="Email Address"
                            name="email"
                            type="email"
                            placeholder="you@example.com"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="bg-white/50 !mb-0"
                        />
                    </div>



                    <Input
                        label="Password"
                        name="password"
                        type="password"
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        className="bg-white/50 !mb-2"
                    />

                    <AnimatedButton
                        type="submit"
                        disabled={loading}
                        className="w-full py-2.5 text-lg mt-1"
                    >
                        {loading ? "Creating..." : "Sign Up"}
                    </AnimatedButton>

                    <p className="text-center text-xs text-gray-600 mt-3">
                        Already have an account?{" "}
                        <span
                            onClick={() => navigate("/login")}
                            className="text-blue-600 font-semibold cursor-pointer hover:underline"
                        >
                            Login
                        </span>
                    </p>
                </form>
            </GlassCard>
        </div>
    );
}
