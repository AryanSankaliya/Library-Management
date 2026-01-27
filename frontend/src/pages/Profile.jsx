import { useEffect, useState } from "react";
import { getMyBooks, deleteUserAccount } from "../api/userApi";
import { getAllBooks } from "../api/bookApi";
import GlassCard from "../components/UI/GlassCard";
import { User, Mail, Shield, BookOpen, Calendar, LogOut, Trash2, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import { useToast } from "../context/ToastContext";
import Input from "../components/UI/Input";

export default function Profile() {
    const navigate = useNavigate();
    const { showToast } = useToast();
    const [user, setUser] = useState({
        email: "",
        role: "",
        name: "User"
    });
    const [myBooks, setMyBooks] = useState([]);
    const [loading, setLoading] = useState(true);

    // Delete Account State
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        const email = localStorage.getItem("email");
        const role = localStorage.getItem("role");
        setUser({ email, role, name: email?.split('@')[0] || "User" });

        const fetchBooks = async () => {
            try {
                if (role === 'admin') {
                    const res = await getAllBooks();
                    setMyBooks(res.data.data);
                } else {
                    const res = await getMyBooks();
                    setMyBooks(res.data.data);
                }
            } catch (err) {
                console.error("Failed to fetch history", err);
            } finally {
                setLoading(false);
            }
        };
        fetchBooks();
    }, [user.role]);

    const handleLogout = () => {
        localStorage.clear();
        navigate("/login");
    };

    const handleDeleteAccount = async () => {
        setIsDeleting(true);
        try {
            await deleteUserAccount({});
            showToast("Account deleted. Returns processed.", "success");
            localStorage.clear();
            navigate("/login");
        } catch (err) {
            showToast(err.response?.data?.message || "Failed to delete account", "error");
        } finally {
            setIsDeleting(false);
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    };

    return (
        <div className="max-w-5xl mx-auto relative">
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-3 gap-4"
            >
                {/* Left Column: User Card */}
                <motion.div variants={itemVariants} className="md:col-span-1">
                    <GlassCard className="p-5 text-center h-full flex flex-col items-center justify-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-b from-blue-500/10 to-transparent pointer-events-none" />

                        <motion.div
                            whileHover={{ scale: 1.05, rotate: 5 }}
                            className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-3xl font-bold text-white shadow-xl mb-4 border-4 border-white/50"
                        >
                            {user.email?.substring(0, 1).toUpperCase()}
                        </motion.div>

                        <h2 className="text-xl font-bold text-gray-800 capitalize">{user.name}</h2>
                        <p className="text-gray-500 mb-4 text-sm">{user.email}</p>

                        <div className="w-full space-y-3">
                            <div className="flex items-center gap-3 p-3 bg-white/50 rounded-xl border border-white/60">
                                <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                                    <Shield size={18} />
                                </div>
                                <div className="text-left">
                                    <p className="text-xs text-gray-500 uppercase font-semibold">Role</p>
                                    <p className="text-sm font-medium text-gray-800 capitalize">{user.role}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 p-3 bg-white/50 rounded-xl border border-white/60">
                                <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
                                    <Mail size={18} />
                                </div>
                                <div className="text-left overflow-hidden">
                                    <p className="text-xs text-gray-500 uppercase font-semibold">Email</p>
                                    <p className="text-sm font-medium text-gray-800 truncate" title={user.email}>{user.email}</p>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={() => setShowLogoutModal(true)}
                            className="mt-6 w-full py-2.5 rounded-xl border border-red-200 text-red-500 hover:bg-red-50 transition-colors flex items-center justify-center gap-2 font-medium text-sm"
                        >
                            <LogOut size={18} /> Sign Out
                        </button>

                        {/* Delete Account Trigger */}
                        <button
                            onClick={() => setShowDeleteModal(true)}
                            className="mt-3 text-xs text-gray-400 hover:text-red-500 transition-colors flex items-center gap-1"
                        >
                            <Trash2 size={12} /> Delete Account
                        </button>
                    </GlassCard>
                </motion.div>

                {/* Right Column: Stats & History */}
                <motion.div variants={itemVariants} className="md:col-span-2 space-y-4">
                    {/* Stats Row */}
                    <div className="grid grid-cols-2 gap-4">
                        <GlassCard className="p-4 flex items-center gap-4">
                            <div className="p-4 bg-emerald-100 text-emerald-600 rounded-full">
                                <BookOpen size={24} />
                            </div>
                            <div>
                                <h3 className="text-3xl font-bold text-gray-800">
                                    {myBooks.length}
                                </h3>
                                <p className="text-gray-500 text-sm">
                                    {user.role === 'admin' ? 'Books Managed' : 'Books Issued'}
                                </p>
                            </div>
                        </GlassCard>
                        <GlassCard className="p-4 flex items-center gap-4">
                            <div className="p-4 bg-orange-100 text-orange-600 rounded-full">
                                <Shield size={24} />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-800 uppercase">
                                    {user.role}
                                </h3>
                                <p className="text-gray-500 text-sm">Account Type</p>
                            </div>
                        </GlassCard>
                    </div>

                    {/* Conditional Content based on Role */}
                    {user.role === 'admin' ? (
                        <GlassCard className="p-5 min-h-[250px]">
                            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                                <Shield size={20} className="text-blue-600" /> Admin Shortcuts
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => navigate('/add-book')}
                                    className="p-6 bg-blue-50 border border-blue-100 rounded-xl flex flex-col items-center justify-center gap-3 hover:shadow-lg transition-all"
                                >
                                    <div className="p-4 bg-blue-500 text-white rounded-full shadow-md">
                                        <BookOpen size={24} />
                                    </div>
                                    <span className="font-semibold text-gray-700">Add Book</span>
                                </motion.button>

                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => navigate('/delete-book')}
                                    className="p-6 bg-red-50 border border-red-100 rounded-xl flex flex-col items-center justify-center gap-3 hover:shadow-lg transition-all"
                                >
                                    <div className="p-4 bg-red-500 text-white rounded-full shadow-md">
                                        <Trash2 size={24} />
                                    </div>
                                    <span className="font-semibold text-gray-700">Delete Book</span>
                                </motion.button>

                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => navigate('/users')}
                                    className="p-6 bg-purple-50 border border-purple-100 rounded-xl flex flex-col items-center justify-center gap-3 hover:shadow-lg transition-all"
                                >
                                    <div className="p-4 bg-purple-500 text-white rounded-full shadow-md">
                                        <User size={24} />
                                    </div>
                                    <span className="font-semibold text-gray-700">Manage Users</span>
                                </motion.button>
                            </div>
                        </GlassCard>
                    ) : (
                        <GlassCard className="p-5 min-h-[250px]">
                            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                                <BookOpen size={20} className="text-blue-600" /> Issued Books History
                            </h3>

                            {loading ? (
                                <div className="space-y-4">
                                    {[1, 2, 3].map(i => <div key={i} className="h-16 bg-gray-100 rounded-xl animate-pulse" />)}
                                </div>
                            ) : myBooks.length === 0 ? (
                                <div className="text-center py-20 text-gray-400">
                                    <BookOpen size={48} className="mx-auto mb-4 opacity-50" />
                                    <p>No books issued yet.</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {myBooks.map((entry, index) => (
                                        <motion.div
                                            key={index}
                                            initial={{ x: 20, opacity: 0 }}
                                            animate={{ x: 0, opacity: 1 }}
                                            transition={{ delay: index * 0.1 }}
                                            className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-white/40 border border-white/60 rounded-xl hover:bg-blue-50/50 transition-colors group gap-4"
                                        >
                                            <div className="flex items-center gap-4 w-full sm:w-auto">
                                                <div className="w-12 h-16 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg shadow-sm flex items-center justify-center text-gray-500 shrink-0">
                                                    <BookOpen size={20} />
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-gray-800 group-hover:text-blue-600 transition-colors line-clamp-1">
                                                        {entry.bookId?.title || "Unknown Book"}
                                                    </h4>
                                                    <p className="text-sm text-gray-500 line-clamp-1">{entry.bookId?.author || "Unknown Author"}</p>
                                                </div>
                                            </div>
                                            <div className="flex sm:block items-center justify-between w-full sm:w-auto text-right mt-2 sm:mt-0 pt-2 sm:pt-0 border-t sm:border-0 border-gray-100">
                                                <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full uppercase tracking-wide">
                                                    Issued
                                                </span>
                                                <span className="ml-2 text-sm text-gray-600">
                                                    {new Date(entry.issuedAt).toLocaleDateString('en-GB', {
                                                        day: '2-digit',
                                                        month: '2-digit',
                                                        year: '2-digit'
                                                    })}
                                                </span>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </GlassCard>
                    )}
                </motion.div>
            </motion.div>

            {/* LOGOUT CONFIRMATION MODAL */}
            {showLogoutModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="w-full max-w-sm bg-white rounded-2xl shadow-xl overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="p-6 text-center space-y-6">
                            <div className="bg-blue-100 text-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
                                <LogOut size={32} className="ml-1" />
                            </div>

                            <div>
                                <h4 className="text-xl font-bold text-gray-800 mb-2">Sign Out?</h4>
                                <p className="text-gray-500">
                                    Are you sure you want to sign out of your account?
                                </p>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowLogoutModal(false)}
                                    className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleLogout}
                                    className="flex-1 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-lg shadow-blue-500/30 transition-all active:scale-95"
                                >
                                    Sign Out
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}

            {/* DELETE ACCOUNT MODAL */}
            {showDeleteModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="p-6 bg-red-50 border-b border-red-100 flex items-center justify-between">
                            <h3 className="text-xl font-bold text-red-600 flex items-center gap-2">
                                <Trash2 size={20} /> Delete Account
                            </h3>
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className="p-1 hover:bg-red-100 rounded-full text-red-400 hover:text-red-600 transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-6 text-center space-y-6">
                            <div className="bg-red-100 text-red-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
                                <Trash2 size={32} />
                            </div>

                            <div>
                                <h4 className="text-lg font-bold text-gray-800 mb-2">Are you sure you want to delete your account?</h4>
                                <p className="text-gray-500 text-sm px-4">
                                    This action is <b>permanent</b>. All your issued books will be returned and your data will be wiped immediately.
                                </p>
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button
                                    onClick={() => setShowDeleteModal(false)}
                                    className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDeleteAccount}
                                    disabled={isDeleting}
                                    className="flex-1 py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold shadow-lg shadow-red-500/30 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isDeleting ? "Deleting..." : "Yes, Delete It"}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
}
