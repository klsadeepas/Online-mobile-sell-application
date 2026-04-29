import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getOrders, updateOrderStatus } from '../../store/slices/orderSlice';
import { FiShoppingBag, FiEye, FiClock, FiCheckCircle, FiPackage, FiTruck, FiAlertCircle } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';

const AdminOrders = () => {
  const dispatch = useDispatch();
  const { orders, isLoading, pages, page: currentPage } = useSelector((state) => state.orders);
  const { isDarkMode } = useSelector((state) => state.theme);
  const [page, setPage] = useState(1);

  useEffect(() => {
    dispatch(getOrders({ page }));
  }, [dispatch, page]);

  const handleStatusChange = async (id, status) => {
    try {
      await dispatch(updateOrderStatus({ id, orderStatus: status })).unwrap();
      toast.success(`Order status updated to ${status}`);
    } catch (error) {
      toast.error(error || 'Failed to update status');
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <FiClock className="text-yellow-500" />;
      case 'confirmed': return <FiCheckCircle className="text-blue-500" />;
      case 'shipped': return <FiTruck className="text-purple-500" />;
      case 'delivered': return <FiPackage className="text-green-500" />;
      case 'cancelled': return <FiAlertCircle className="text-red-500" />;
      default: return null;
    }
  };

  return (
    <div className={`min-h-screen pt-24 pb-20 ${isDarkMode ? 'bg-slate-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-extrabold mb-8 flex items-center gap-3">
          <FiShoppingBag className="text-blue-500" /> Order Management
        </h1>

        <div className={`p-6 rounded-3xl border ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-100'} shadow-sm overflow-hidden`}>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-700">
              <thead className={isDarkMode ? 'bg-slate-700' : 'bg-gray-50'}>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Order ID</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Total</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
                {orders.map((order) => (
                  <tr key={order._id} className={isDarkMode ? 'hover:bg-slate-700/50' : 'hover:bg-gray-50'}>
                    <td className="px-6 py-4 whitespace-nowrap font-mono text-sm">{order.orderId}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold">{order.user?.name || 'Guest'}</div>
                      <div className="text-xs text-gray-500">{order.user?.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-bold text-blue-600">${order.total.toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(order.orderStatus)}
                        <select
                          value={order.orderStatus}
                          onChange={(e) => handleStatusChange(order._id, e.target.value)}
                          className={`text-xs font-bold p-1 rounded border outline-none ${
                            isDarkMode ? 'bg-slate-700 border-slate-600' : 'bg-white border-gray-200'
                          }`}
                        >
                          {['pending', 'confirmed', 'processing', 'shipped', 'out_for_delivery', 'delivered', 'cancelled'].map(s => (
                            <option key={s} value={s}>{s.replace('_', ' ')}</option>
                          ))}
                        </select>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link to={`/orders/${order._id}`} className="text-blue-500 hover:text-blue-700">
                        <FiEye size={20} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {pages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              {[...Array(pages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={`w-8 h-8 rounded-lg font-bold ${currentPage === i + 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-slate-700'}`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminOrders;