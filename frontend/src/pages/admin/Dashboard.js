import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { orderAPI, productAPI, userAPI } from '../../utils/api';
import { FiUsers, FiShoppingBag, FiPackage, FiDollarSign, FiBarChart2, FiSmartphone } from 'react-icons/fi';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const AdminDashboard = () => {
  const { isDarkMode } = useSelector((state) => state.theme);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalRevenue: 0,
    monthlySales: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [orderStatsRes, productStatsRes, userStatsRes] = await Promise.all([
          orderAPI.getOrderStats(),
          productAPI.getProducts(), // Using getProducts to get total count
          userAPI.getUserStats(),
        ]);

        setStats({
          totalUsers: userStatsRes.data.totalUsers,
          totalOrders: orderStatsRes.data.totalOrders,
          totalProducts: productStatsRes.data.total,
          totalRevenue: orderStatsRes.data.totalRevenue,
          monthlySales: orderStatsRes.data.monthlySales,
        });
      } catch (error) {
        console.error('Failed to fetch admin stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const chartData = {
    labels: stats.monthlySales.map(s => new Date(2000, s._id - 1, 1).toLocaleString('default', { month: 'short' })),
    datasets: [
      {
        label: 'Monthly Sales',
        data: stats.monthlySales.map(s => s.total),
        borderColor: isDarkMode ? '#8B5CF6' : '#2563EB', // Purple/Blue
        backgroundColor: isDarkMode ? 'rgba(139, 92, 246, 0.2)' : 'rgba(37, 99, 235, 0.2)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: isDarkMode ? '#CBD5E1' : '#4B5563',
        },
      },
      title: {
        display: true,
        text: 'Last 6 Months Sales Overview',
        color: isDarkMode ? '#E2E8F0' : '#1F2937',
      },
    },
    scales: {
      x: {
        ticks: {
          color: isDarkMode ? '#9CA3AF' : '#6B7280',
        },
        grid: {
          color: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
        },
      },
      y: {
        ticks: {
          color: isDarkMode ? '#9CA3AF' : '#6B7280',
          callback: function(value) {
            return '$' + value.toLocaleString();
          }
        },
        grid: {
          color: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
        },
      },
    },
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const statCards = [
    { title: 'Total Users', value: stats.totalUsers, icon: FiUsers, color: 'text-blue-500', bg: 'bg-blue-100 dark:bg-blue-900/20' },
    { title: 'Total Products', value: stats.totalProducts, icon: FiSmartphone, color: 'text-purple-500', bg: 'bg-purple-100 dark:bg-purple-900/20' },
    { title: 'Total Orders', value: stats.totalOrders, icon: FiPackage, color: 'text-green-500', bg: 'bg-green-100 dark:bg-green-900/20' },
    { title: 'Total Revenue', value: `$${stats.totalRevenue.toLocaleString()}`, icon: FiDollarSign, color: 'text-yellow-500', bg: 'bg-yellow-100 dark:bg-yellow-900/20' },
  ];

  return (
    <div className={`min-h-screen pt-24 pb-20 ${isDarkMode ? 'bg-slate-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-extrabold mb-10">Admin Dashboard</h1>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {statCards.map((card, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-6 rounded-3xl border ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-100'} shadow-sm flex items-center gap-4`}
            >
              <div className={`p-3 rounded-xl ${card.bg} ${card.color}`}>
                <card.icon size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500">{card.title}</p>
                <h2 className="text-2xl font-bold">{card.value}</h2>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Monthly Sales Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className={`p-8 rounded-3xl border ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-100'} shadow-sm`}
        >
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <FiBarChart2 className="text-blue-500" /> Sales Overview
          </h2>
          <div className="h-80">
            <Line data={chartData} options={chartOptions} />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard;