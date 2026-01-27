import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { BookOpen, Search, Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
    const navigate = useNavigate();

    // Floating animation variant
    const floating = {
        animate: {
            y: [0, -20, 0],
            rotate: [0, 2, -2, 0],
            transition: {
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
            },
        },
    };

    // Particle animation variants
    const particleVariant = (i) => ({
        animate: {
            y: [0, -100, 0],
            x: [0, 50, -50, 0],
            opacity: [0.2, 0.5, 0.2],
            scale: [1, 1.5, 1],
            transition: {
                duration: 10 + i * 2,
                repeat: Infinity,
                ease: "linear",
            },
        },
    });

    return (
        <div className="fixed inset-0 z-[100] h-screen w-full overflow-hidden bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">

            {/* Background Particles */}
            {[...Array(5)].map((_, i) => (
                <motion.div
                    key={i}
                    variants={particleVariant(i)}
                    animate="animate"
                    className="absolute rounded-full blur-3xl"
                    style={{
                        background: `rgba(${100 + i * 30}, ${150 + i * 20}, 255, 0.1)`,
                        width: `${200 + i * 100}px`,
                        height: `${200 + i * 100}px`,
                        top: `${Math.random() * 100}%`,
                        left: `${Math.random() * 100}%`,
                        zIndex: 0,
                    }}
                />
            ))}

            <div className="relative z-10 text-center max-w-2xl mx-auto">

                {/* Floating Book Animation */}
                <motion.div
                    variants={floating}
                    animate="animate"
                    className="relative inline-block mb-12"
                >
                    {/* Main Book Icon with Glow */}
                    <div className="relative z-10">
                        <BookOpen size={120} strokeWidth={1} className="text-blue-600 drop-shadow-2xl" />
                    </div>

                    {/* Glow Effect behind book */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-blue-400/20 blur-[50px] rounded-full -z-10" />

                    {/* Animated Magnifying Glass */}
                    <motion.div
                        className="absolute -bottom-4 -right-12 text-indigo-500"
                        animate={{
                            x: [-10, 10, -10],
                            y: [-10, 10, -10],
                            rotate: [0, 15, 0]
                        }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    >
                        <Search size={64} strokeWidth={2} className="drop-shadow-lg" />
                    </motion.div>
                </motion.div>

                {/* Text Content */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    <h1 className="text-8xl md:text-9xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-indigo-600 mb-4 tracking-tighter">
                        404
                    </h1>
                    <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-4">
                        Page Not Found
                    </h2>
                    <p className="text-gray-500 text-lg md:text-xl mb-2">
                        Looks like this page has been misplaced in the library archives.
                    </p>
                    <p className="text-gray-400 text-sm md:text-base mb-10">
                        Don’t worry, you can return to the shelves below.
                    </p>
                </motion.div>

                {/* Buttons */}
                <motion.div
                    className="flex flex-col sm:flex-row items-center justify-center gap-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                >
                    {/* Primary CTA */}
                    <Link to="/">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-8 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium shadow-lg shadow-blue-500/30 flex items-center gap-2 group relative overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                            <Home size={20} />
                            <span>Back to Library Home</span>
                        </motion.button>
                    </Link>


                </motion.div>

            </div>
        </div>
    );
}
