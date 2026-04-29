import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { orderAPI } from '../../utils/api';
import { FiPackage, FiChevronRight, FiClock, FiCheckCircle, FiXCircle } from 'react-icons/fi';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useSelector((state) => state.auth);
  const { isDarkMode } = useSelector((state) => state.theme);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await orderAPI.getUserOrders(user._id);
        setOrders(data);
      } catch (error) {
        console.error('Failed to fetch orders');
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchOrders();
  }, [user]);

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-700',
      confirmed: 'bg-blue-100 text-blue-700',
      shipped: 'bg-purple-100 text-purple-700',
      delivered: 'bg-green-100 text-green-700',
      cancelled: 'bg-red-100 text-red-700'
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className={`min-h-screen pt-24 pb-20 ${isDarkMode ? 'bg-slate-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="max-w-5xl mx-auto px-4">
        <header className="mb-10">
          <h1 className="text-3xl font-extrabold flex items-center gap-3">
            <FiPackage className="text-blue-500" /> My Orders
          </h1>
          <p className="text-gray-500 mt-2">Track and manage your recent purchases</p>
        </header>

        {orders.length === 0 ? (
          <div className={`p-12 text-center rounded-3xl border ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-100'}`}>
            <FiPackage size={48} className="mx-auto text-gray-300 mb-4" />
            <h2 className="text-xl font-bold">No orders found</h2>
            <p className="text-gray-500 mb-6">You haven't placed any orders yet.</p>
            <Link to="/products" className="inline-block bg-blue-600 text-white px-8 py-3 rounded-xl font-bold">Start Shopping</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <motion.div
                key={order._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-6 rounded-3xl border transition-all hover:shadow-lg ${
                  isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-100'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-2xl text-blue-600">
                      <FiPackage size={24} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-500 uppercase">Order ID</p>
                      <p className="font-mono font-bold text-sm">{order.orderId}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-6 flex-1 md:px-8">
                    <div>
                      <p className="text-xs font-bold text-gray-500 uppercase">Placed On</p>
                      <p className="font-semibold text-sm">{new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-500 uppercase">Total</p>
                      <p className="font-bold text-sm text-blue-600">${order.total.toLocaleString()}</p>
                    </div>
                    <div className="col-span-2 md:col-span-1">
                      <p className="text-xs font-bold text-gray-500 uppercase mb-1">Status</p>
                      <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${getStatusColor(order.orderStatus)}`}>
                        {order.orderStatus.replace('_', ' ')}
                      </span>
                    </div>
                  </div>

                  <Link 
                    to={`/orders/${order._id}`}
                    className={`flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${
                      isDarkMode ? 'bg-slate-700 hover:bg-slate-600' : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                  >
                    Details <FiChevronRight />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;