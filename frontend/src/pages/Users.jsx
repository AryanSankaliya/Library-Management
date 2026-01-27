import { useEffect, useState } from "react";
import { getAllUsers } from "../api/userApi";
import GlassCard from "../components/UI/GlassCard";
import { Users as UsersIcon, ShieldAlert } from "lucide-react";
import { motion } from "framer-motion";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await getAllUsers();
        setUsers(res.data.data);
      } catch (err) {
        console.error("Failed to fetch users", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-10 text-center md:text-left">
        <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-600 to-red-600">
          User Management
        </h2>
        <p className="text-gray-500 mt-2">Manage registered users and permissions</p>
      </div>

      <GlassCard className="overflow-hidden border border-white/40">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="px-6 py-4 text-gray-500 font-semibold uppercase text-xs tracking-wider">User</th>
                <th className="px-6 py-4 text-gray-500 font-semibold uppercase text-xs tracking-wider">Role</th>
                <th className="px-6 py-4 text-gray-500 font-semibold uppercase text-xs tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                // Skeleton loading rows
                [1, 2, 3].map(i => (
                  <tr key={i}>
                    <td className="px-6 py-4"><div className="h-10 w-32 bg-gray-200 rounded animate-pulse" /></td>
                    <td className="px-6 py-4"><div className="h-6 w-16 bg-gray-200 rounded animate-pulse" /></td>
                    <td className="px-6 py-4"><div className="h-6 w-16 bg-gray-200 rounded animate-pulse" /></td>
                  </tr>
                ))
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan="3" className="px-6 py-8 text-center text-gray-500">No users found</td>
                </tr>
              ) : (
                users.map((user, index) => (
                  <motion.tr
                    key={user._id || index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center text-white font-bold shadow-md uppercase">
                          {user.name ? user.name.charAt(0) : "U"}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-800">{user.name || "Unknown User"}</div>
                          <div className="text-sm text-gray-500">{user.email || "No Email"}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700 border border-gray-200 uppercase">
                        {user.role || "User"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="flex items-center gap-1 text-green-600 font-medium text-sm">
                        <span className={`w-2 h-2 rounded-full ${user.status === 'inactive' ? 'bg-red-500' : 'bg-green-500'}`}></span>
                        {user.status || "Active"}
                      </span>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
}