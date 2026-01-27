import { useEffect, useState } from "react";
import { getAllBooks } from "../api/bookApi";
import { getAllUsers } from "../api/userApi";
import { getRecentActivities } from "../api/activityApi";
import { motion } from "framer-motion";
import GlassCard from "../components/UI/GlassCard";
import { BookOpen, Users, CheckCircle, TrendingUp } from "lucide-react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

const Counter = ({ from, to }) => {
  const [count, setCount] = useState(from);

  useEffect(() => {
    const controls = {
      val: from
    };

    // Simple js animation, or we could use framer motion useSpring/useTransform, but setInterval is easy for integer counting
    const duration = 1500; // ms
    const steps = 60;
    const intervalTime = duration / steps;
    const stepValue = (to - from) / steps;

    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      if (currentStep >= steps) {
        setCount(to);
        clearInterval(timer);
      } else {
        setCount(Math.round(from + (stepValue * currentStep)));
      }
    }, intervalTime);

    return () => clearInterval(timer);
  }, [from, to]);

  return <span>{count}</span>;
}

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalBooks: 0,
    issuedBooks: 0,
    activeUsers: 0,
    recentActivity: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [booksRes, usersRes, activityRes] = await Promise.allSettled([
          getAllBooks(),
          getAllUsers(),
          getRecentActivities()
        ]);

        let totalBooks = 0;
        let issuedBooks = 0;
        let activeUsers = 0;
        let recentActivity = [];

        if (booksRes.status === "fulfilled") {
          const books = booksRes.value.data.data || [];
          totalBooks = books.length;
          issuedBooks = books.filter(b => b.issued).length;
        }

        if (usersRes.status === "fulfilled") {
          const users = usersRes.value.data?.data || [];
          activeUsers = users.length;
        }

        if (activityRes.status === "fulfilled") {
          recentActivity = activityRes.value.data.data || [];
        }

        setStats({ totalBooks, issuedBooks, activeUsers, recentActivity });
      } catch (err) {
        console.error("Dashboard stats error", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const chartData = [
    { name: 'Available Books', value: stats.totalBooks - stats.issuedBooks },
    { name: 'Issued Books', value: stats.issuedBooks },
  ];

  const COLORS = ['#3B82F6', '#10B981']; // Blue and Emerald

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="text-left"
      >
        <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
          Dashboard Overview
        </h1>
        <p className="text-gray-500 mt-2">Real-time insights and statistics</p>
      </motion.div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => <div key={i} className="h-40 bg-gray-200/50 rounded-2xl animate-pulse" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div variants={cardVariants} initial="hidden" animate="visible" transition={{ delay: 0.1 }}>
            <GlassCard className="p-6 relative overflow-hidden group hover:border-blue-300 transition-colors">
              <div className="absolute right-0 top-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                <BookOpen size={100} className="text-blue-600" />
              </div>
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-blue-100 rounded-xl text-blue-600">
                  <BookOpen size={24} />
                </div>
                <h3 className="text-lg font-semibold text-gray-700">Total Books</h3>
              </div>
              <div className="text-4xl font-bold text-gray-800">
                <Counter from={0} to={stats.totalBooks} />
              </div>
              <p className="text-sm text-gray-500 mt-2 flex items-center gap-1">
                <TrendingUp size={14} className="text-green-500" />
                <span className="text-green-600 font-medium">+2 new</span> this week
              </p>
            </GlassCard>
          </motion.div>

          <motion.div variants={cardVariants} initial="hidden" animate="visible" transition={{ delay: 0.2 }}>
            <GlassCard className="p-6 relative overflow-hidden group hover:border-emerald-300 transition-colors">
              <div className="absolute right-0 top-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                <CheckCircle size={100} className="text-emerald-600" />
              </div>
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-emerald-100 rounded-xl text-emerald-600">
                  <CheckCircle size={24} />
                </div>
                <h3 className="text-lg font-semibold text-gray-700">Issued Books</h3>
              </div>
              <div className="text-4xl font-bold text-gray-800">
                <Counter from={0} to={stats.issuedBooks} />
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Currently borrowed by members
              </p>
            </GlassCard>
          </motion.div>

          <motion.div variants={cardVariants} initial="hidden" animate="visible" transition={{ delay: 0.3 }}>
            <GlassCard className="p-6 relative overflow-hidden group hover:border-purple-300 transition-colors">
              <div className="absolute right-0 top-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                <Users size={100} className="text-purple-600" />
              </div>
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-purple-100 rounded-xl text-purple-600">
                  <Users size={24} />
                </div>
                <h3 className="text-lg font-semibold text-gray-700">Active Users</h3>
              </div>
              <div className="text-4xl font-bold text-gray-800">
                <Counter from={0} to={stats.activeUsers} />
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Registered library members
              </p>
            </GlassCard>
          </motion.div>
        </div>
      )}

      {/* Recent activity or chart could go here, keeping it clean for now */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <GlassCard className="min-h-[300px] flex flex-col items-center justify-center p-6">
          <h3 className="text-xl font-bold text-gray-700 mb-6 self-start">Book Distribution</h3>
          <div className="w-full h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        <GlassCard className="min-h-[300px] flex flex-col p-6 relative overflow-hidden">
          <h3 className="text-xl font-bold text-gray-700 mb-6 flex items-center gap-2">
            <CheckCircle size={20} className="text-blue-500" />
            Recent Activity
          </h3>

          <div className="space-y-4 overflow-y-auto max-h-[300px] pr-2 custom-scrollbar">
            {stats.recentActivity.length === 0 ? (
              <p className="text-gray-400 text-center py-10">No recent activity found.</p>
            ) : (
              stats.recentActivity.map((activity, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-4 p-3 rounded-xl bg-white/40 hover:bg-white/60 transition-colors border border-white/50 shadow-sm"
                >
                  <div className={`p-2 rounded-lg mt-1 ${activity.action === 'LOGIN' ? 'bg-green-100 text-green-600' :
                    activity.action === 'DELETE_USER' ? 'bg-red-100 text-red-600' :
                      'bg-blue-100 text-blue-600'
                    }`}>
                    {activity.action === 'LOGIN' ? <Users size={16} /> : <BookOpen size={16} />}
                  </div>
                  <div>
                    <p className="text-gray-800 font-medium text-sm">
                      <span className="font-bold text-gray-900">{activity.user}</span> <span className="text-xs text-gray-500">({activity.action})</span>
                    </p>
                    <p className="text-sm text-gray-600">{activity.details}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(activity.timestamp).toLocaleDateString('en-GB')} • {new Date(activity.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
