import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { BookOpen, User, LogOut, Home, PlusCircle, Bookmark, Trash2, Library } from "lucide-react";

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const email = localStorage.getItem("email");

  // Don't show sidebar on public pages if not logged in
  // Or if you want specific pages to be full screen
  const publicPaths = ["/login", "/register", "/"];
  if (publicPaths.includes(location.pathname) && !token) return null;

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
      // Dashboard for user might just be "Books" or actual dashboard if we had one
      { name: "Library", path: "/books", icon: <Library size={20} /> },
      { name: "My Issued Books", path: "/my-books", icon: <Bookmark size={20} /> },
      { name: "My Profile", path: "/profile", icon: <User size={20} /> },
    ];
  }

  return (
    <motion.div
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="w-72 h-screen bg-white/30 backdrop-blur-xl border-r border-white/40 flex flex-col p-6 sticky top-0"
    >
      <div className="mb-10 flex items-center gap-3 px-2">
        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg">
          <BookOpen size={24} />
        </div>
        <div>
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-indigo-700">
            LibrarySys
          </h1>
          <p className="text-xs text-gray-500 font-medium">Management System</p>
        </div>
      </div>

      <div className="flex-1 space-y-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link key={item.path} to={item.path}>
              <div className="relative mb-2 group">
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-md"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <div className={`relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${isActive ? "text-white font-medium" : "text-gray-600 hover:bg-white/50 hover:text-blue-600"
                  }`}>
                  {item.icon}
                  <span>{item.name}</span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="pt-6 border-t border-gray-200/50">
        <div className="flex items-center gap-3 mb-4 px-2">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm shadow-md">
            {email?.substring(0, 2).toUpperCase() || "US"}
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-bold text-gray-700 truncate">{email?.split('@')[0]}</p>
            <p className="text-xs text-gray-500 capitalize">{role}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 p-3 rounded-xl border border-red-100 text-red-500 hover:bg-red-50 hover:text-red-600 transition-all font-medium group"
        >
          <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
          Sign Out
        </button>
      </div>
    </motion.div>
  );
}
