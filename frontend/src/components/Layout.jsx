import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, User, LogOut, Home, PlusCircle, Bookmark, Trash2, Library } from "lucide-react";

const Navbar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    const email = localStorage.getItem("email");
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);

    // Close menu when route changes
    React.useEffect(() => {
        setIsMenuOpen(false);
    }, [location.pathname]);

    // Don't show navbar on login/register pages
    if (["/login", "/register", "/forgot-password", "/"].includes(location.pathname) && !token) return null;

    const handleLogout = () => {
        localStorage.clear();
        navigate("/login");
    };

    let navItems = [];

    if (role === 'admin') {
        navItems = [
            { name: "Dashboard", path: "/", icon: <Home size={20} /> },
            { name: "All Books", path: "/books", icon: <BookOpen size={20} /> },
            { name: "Add Book", path: "/add-book", icon: <PlusCircle size={20} /> },
            { name: "Delete Book", path: "/delete-book", icon: <Trash2 size={20} /> },
            { name: "Manage Users", path: "/users", icon: <User size={20} /> },
        ];
    } else {
        // User Role
        navItems = [
            { name: "Library", path: "/books", icon: <Library size={20} /> },
            { name: "My Issued Books", path: "/my-books", icon: <Bookmark size={20} /> },
            { name: "My Profile", path: "/profile", icon: <User size={20} /> },
        ];
    }

    return (
        <>
            <motion.nav
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                className="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex justify-between items-center backdrop-blur-lg bg-white/30 border-b border-white/20 shadow-sm"
            >
                <Link to="/books" className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center gap-2">
                    <BookOpen className="text-blue-600" /> LMS
                </Link>

                {/* Mobile Menu Button */}
                <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="md:hidden p-2 text-gray-600 hover:bg-white/50 rounded-lg transition-colors"
                >
                    {isMenuOpen ? <LogOut size={24} className="rotate-45" /> : <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>}
                </button>

                {/* Desktop Navigation */}
                <div className="hidden md:flex gap-2">
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <Link key={item.path} to={item.path}>
                                <motion.div
                                    className={`relative px-4 py-2 rounded-xl flex items-center gap-2 transition-colors ${isActive ? "text-blue-600 font-semibold" : "text-gray-600 hover:text-blue-500"
                                        }`}
                                >
                                    {isActive && (
                                        <motion.div
                                            layoutId="nav-pill"
                                            className="absolute inset-0 bg-blue-100/50 rounded-xl -z-10"
                                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                        />
                                    )}
                                    {item.icon}
                                    <span>{item.name}</span>
                                </motion.div>
                            </Link>
                        );
                    })}

                    {token && (
                        <Link to="/profile">
                            <motion.div
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center text-white font-bold shadow-md cursor-pointer border-2 border-white/50"
                            >
                                {email?.substring(0, 1).toUpperCase() || "US"}
                            </motion.div>
                        </Link>
                    )}
                </div>
            </motion.nav>

            {/* Mobile Dropdown Menu */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="fixed top-[72px] left-0 right-0 z-40 bg-white/90 backdrop-blur-xl border-b border-gray-100 shadow-xl md:hidden overflow-hidden"
                    >
                        <div className="flex flex-col p-4 gap-2">
                            {navItems.map((item) => {
                                const isActive = location.pathname === item.path;
                                return (
                                    <Link key={item.path} to={item.path}>
                                        <div className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive ? "bg-blue-50 text-blue-600 font-semibold" : "text-gray-600 hover:bg-gray-50"
                                            }`}>
                                            {item.icon}
                                            <span>{item.name}</span>
                                        </div>
                                    </Link>
                                );
                            })}

                            {token && (
                                <div className="mt-2 pt-4 border-t border-gray-100">
                                    <Link to="/profile">
                                        <div className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 text-gray-700">
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center text-white font-bold text-sm">
                                                {email?.substring(0, 1).toUpperCase() || "US"}
                                            </div>
                                            <span className="font-medium">My Profile</span>
                                        </div>
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 mt-2 font-medium"
                                    >
                                        <LogOut size={20} />
                                        <span>Sign Out</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

const Layout = ({ children }) => {
    const location = useLocation();
    const isAuthPage = ["/login", "/register", "/forgot-password"].includes(location.pathname);

    return (
        <div className={`min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 text-gray-800 font-sans selection:bg-indigo-200 ${isAuthPage ? "h-screen overflow-hidden flex items-center justify-center p-0" : ""
            }`}>
            <Navbar />
            <div className={isAuthPage ? "w-full flex items-center justify-center" : "pt-24 pb-6 px-4 max-w-7xl mx-auto"}>
                <AnimatePresence mode="wait">
                    <motion.div
                        key={location.pathname}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className={isAuthPage ? "w-full flex justify-center" : "w-full"}
                    >
                        {children}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
};

export default Layout;