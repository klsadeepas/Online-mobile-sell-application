import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { orderAPI } from '../../utils/api';
import { FiArrowLeft, FiMapPin, FiCreditCard, FiPackage, FiTruck, FiCheckCircle, FiXCircle } from 'react-icons/fi';
import { toast } from 'react-toastify';

const OrderDetails = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const { isDarkMode } = useSelector((state) => state.theme);

  const fetchOrder = async () => {
    try {
      const { data } = await orderAPI.getOrderById(id);
      setOrder(data);
    } catch (error) {
      toast.error('Failed to load order details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrder(); }, [id]);

  const handleCancel = async () => {
    if (window.confirm('Are you sure you want to cancel this order?')) {
      try {
        await orderAPI.cancelOrder(id);
        toast.success('Order cancelled successfully');
        fetchOrder();
      } catch (error) {
        toast.error(error.response?.data?.message || 'Cancellation failed');
      }
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div></div>;
  if (!order) return <div className="text-center py-20">Order not found</div>;

  const steps = [
    { id: 'pending', label: 'Pending', icon: FiPackage },
    { id: 'confirmed', label: 'Confirmed', icon: FiCheckCircle },
    { id: 'shipped', label: 'Shipped', icon: FiTruck },
    { id: 'delivered', label: 'Delivered', icon: FiCheckCircle }
  ];

  const currentStepIndex = steps.findIndex(s => s.id === order.orderStatus);

  return (
    <div className={`min-h-screen pt-24 pb-20 ${isDarkMode ? 'bg-slate-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="max-w-5xl mx-auto px-4">
        <Link to="/orders" className="inline-flex items-center gap-2 text-blue-500 font-bold mb-8 hover:underline">
          <FiArrowLeft /> Back to Orders
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Status Tracker */}
            <div className={`p-8 rounded-3xl border ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-100'} shadow-sm`}>
              <div className="flex items-center justify-between mb-10">
                <h2 className="text-xl font-bold">Track Order</h2>
                <span className="font-mono text-sm text-gray-500">{order.orderId}</span>
              </div>
              
              <div className="relative flex justify-between">
                <div className="absolute top-5 left-0 w-full h-1 bg-gray-200 dark:bg-slate-700 -z-0"></div>
                <div className="absolute top-5 left-0 h-1 bg-blue-600 transition-all duration-1000 -z-0" style={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}></div>
                
                {steps.map((step, idx) => {
                  const Icon = step.icon;
                  const isActive = idx <= currentStepIndex;
                  return (
                    <div key={step.id} className="relative z-10 flex flex-col items-center">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-500 ${isActive ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-slate-700 text-gray-400'}`}>
                        <Icon />
                      </div>
                      <p className={`text-[10px] font-bold mt-2 uppercase tracking-tighter ${isActive ? 'text-blue-600' : 'text-gray-400'}`}>{step.label}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Items */}
            <div className={`p-8 rounded-3xl border ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-100'} shadow-sm`}>
              <h3 className="font-bold mb-6">Order Items</h3>
              <div className="divide-y divide-gray-100 dark:divide-slate-700">
                {order.orderItems.map(item => (
                  <div key={item._id} className="py-4 flex items-center gap-6">
                    <img src={item.image} alt="" className="w-16 h-16 object-contain bg-gray-50 rounded-xl" />
                    <div className="flex-1">
                      <p className="font-bold text-sm">{item.name}</p>
                      <p className="text-xs text-gray-500">{item.quantity} x ${item.price.toLocaleString()}</p>
                    </div>
                    <p className="font-bold">Rs. {item.totalPrice.toLocaleString()}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-8">
            {/* Summary */}
            <div className={`p-8 rounded-3xl border ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-100'} shadow-sm`}>
              <h3 className="font-bold mb-6">Summary</h3>
              <div className="space-y-4 text-sm">
                <div className="flex justify-between text-gray-500"><span>Subtotal</span><span>Rs. {order.subtotal.toLocaleString()}</span></div>
                <div className="flex justify-between text-gray-500"><span>Tax</span><span>Rs. {order.tax.toLocaleString()}</span></div>
                <div className="flex justify-between text-gray-500"><span>Shipping</span><span>Rs. {order.shipping.toLocaleString()}</span></div>
                {order.discount > 0 && <div className="flex justify-between text-green-500 font-bold"><span>Discount</span><span>-${order.discount.toLocaleString()}</span></div>}
                <div className="flex justify-between text-xl font-extrabold border-t pt-4"><span>Total</span><span className="text-blue-600">Rs. {order.total.toLocaleString()}</span></div>
              </div>

              {['pending', 'confirmed'].includes(order.orderStatus) && (
                <button onClick={handleCancel} className="w-full mt-8 py-3 border-2 border-red-500 text-red-500 rounded-xl font-bold hover:bg-red-500 hover:text-white transition-all">
                  Cancel Order
                </button>
              )}
            </div>

            {/* Delivery Info */}
            <div className={`p-8 rounded-3xl border ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-100'} shadow-sm`}>
              <div className="flex items-center gap-3 mb-6"><FiMapPin className="text-blue-500" /><h3 className="font-bold">Delivery Address</h3></div>
              <p className="text-sm font-bold">{order.shippingAddress.fullName}</p>
              <p className="text-sm text-gray-500 leading-relaxed mt-1">
                {order.shippingAddress.address}, {order.shippingAddress.city}<br />
                {order.shippingAddress.state}, {order.shippingAddress.zipCode}
              </p>
              <p className="text-sm font-bold mt-4">{order.shippingAddress.phone}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;