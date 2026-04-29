import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { createOrder, reset } from '../../store/slices/orderSlice';
import { couponAPI } from '../../utils/api';
import { FiMapPin, FiCreditCard, FiTruck, FiCheckCircle, FiPercent } from 'react-icons/fi';
import { toast } from 'react-toastify';

const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { cart } = useSelector((state) => state.cart);
  const { isLoading, order, isError, message } = useSelector((state) => state.orders);
  const { isDarkMode } = useSelector((state) => state.theme);

  const [shippingAddress, setShippingAddress] = useState({
    fullName: user?.name || '',
    address: user?.address || '',
    city: '',
    state: '',
    zipCode: '',
    country: 'USA',
    phone: user?.phone || ''
  });

  const [paymentMethod, setPaymentMethod] = useState('credit_card');
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [discountAmount, setDiscountAmount] = useState(0);

  useEffect(() => {
    if (!cart || cart.items.length === 0) {
      navigate('/cart');
    }
  }, [cart, navigate]);

  useEffect(() => {
    if (order) {
      toast.success('Order placed successfully!');
      navigate(`/orders/${order._id}`);
      dispatch(reset());
    }
    if (isError) toast.error(message);
  }, [order, isError, message, navigate, dispatch]);

  const handleInputChange = (e) => {
    setShippingAddress({ ...shippingAddress, [e.target.name]: e.target.value });
  };

  const handleApplyCoupon = async () => {
    if (!couponCode) return;
    try {
      const { data } = await couponAPI.validateCoupon({ code: couponCode, subtotal: cart.subtotal });
      setAppliedCoupon(data.coupon);
      setDiscountAmount(data.discount);
      toast.success(`Coupon applied: Rs. ${data.discount} off!`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Invalid coupon code');
      setAppliedCoupon(null);
      setDiscountAmount(0);
    }
  };

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    dispatch(createOrder({
      userId: user._id,
      shippingAddress,
      paymentMethod,
      couponCode: appliedCoupon?.code || ''
    }));
  };

  const inputStyle = `w-full p-3 rounded-xl border focus:ring-2 focus:ring-blue-500 outline-none transition-all ${
    isDarkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-gray-50 border-gray-200'
  }`;

  const finalTotal = cart ? Math.max(0, cart.subtotal - discountAmount) : 0;

  return (
    <div className={`min-h-screen pt-24 pb-20 ${isDarkMode ? 'bg-slate-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Left: Shipping & Payment Forms */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
            <div className={`p-8 rounded-3xl border ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-100'} shadow-sm`}>
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3"><FiMapPin className="text-blue-500"/> Shipping Address</h2>
              <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2 space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase">Full Name</label>
                  <input name="fullName" value={shippingAddress.fullName} onChange={handleInputChange} className={inputStyle} required />
                </div>
                <div className="md:col-span-2 space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase">Address</label>
                  <input name="address" value={shippingAddress.address} onChange={handleInputChange} className={inputStyle} required />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase">City</label>
                  <input name="city" value={shippingAddress.city} onChange={handleInputChange} className={inputStyle} required />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase">State</label>
                  <input name="state" value={shippingAddress.state} onChange={handleInputChange} className={inputStyle} required />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase">Zip Code</label>
                  <input name="zipCode" value={shippingAddress.zipCode} onChange={handleInputChange} className={inputStyle} required />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase">Phone</label>
                  <input name="phone" value={shippingAddress.phone} onChange={handleInputChange} className={inputStyle} required />
                </div>
              </form>
            </div>

            <div className={`p-8 rounded-3xl border ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-100'} shadow-sm`}>
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3"><FiCreditCard className="text-blue-500"/> Payment Method</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { id: 'credit_card', label: 'Credit Card', icon: FiCreditCard },
                  { id: 'cash_on_delivery', label: 'Cash on Delivery', icon: FiTruck },
                  { id: 'mobile_wallet', label: 'Mobile Wallet', icon: FiCheckCircle }
                ].map((method) => (
                  <button
                    key={method.id}
                    onClick={() => setPaymentMethod(method.id)}
                    className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${
                      paymentMethod === method.id 
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600' 
                        : isDarkMode ? 'border-slate-700 hover:border-slate-600' : 'border-gray-100 hover:border-gray-200'
                    }`}
                  >
                    <method.icon size={24} />
                    <span className="text-xs font-bold">{method.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right: Order Summary & Coupons */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
            <div className={`p-8 rounded-3xl border ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-100'} shadow-lg`}>
              <h2 className="text-2xl font-bold mb-6">Order Review</h2>
              
              {/* Mini Item List */}
              <div className="space-y-4 mb-8 max-h-60 overflow-y-auto pr-2">
                {cart?.items.map(item => (
                  <div key={item._id} className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg p-1 flex-shrink-0">
                      <img src={item.image} alt="" className="w-full h-full object-contain" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold line-clamp-1">{item.name}</p>
                      <p className="text-xs text-gray-500">{item.quantity} x ${item.price.toLocaleString()}</p>
                    </div>
                    <p className="text-sm font-bold">Rs. {item.totalPrice.toLocaleString()}</p>
                  </div>
                ))}
              </div>

              {/* Coupon System */}
              <div className="mb-8">
                <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Have a Coupon?</label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <FiPercent className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                      placeholder="Code (e.g. SAVE10)" 
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className={`${inputStyle} pl-10`}
                    />
                  </div>
                  <button 
                    onClick={handleApplyCoupon}
                    className="px-6 bg-slate-900 text-white dark:bg-white dark:text-slate-900 rounded-xl font-bold hover:scale-105 transition-all"
                  >
                    Apply
                  </button>
                </div>
                {appliedCoupon && (
                  <div className="mt-2 flex items-center justify-between p-2 bg-green-100 text-green-700 rounded-lg text-xs font-bold animate-fade-in">
                    <span>Coupon "{appliedCoupon.code}" Applied!</span>
                    <button onClick={() => { setAppliedCoupon(null); setDiscountAmount(0); }} className="hover:underline">Remove</button>
                  </div>
                )}
              </div>

              {/* Summary Totals */}
              <div className="space-y-3 mb-8 border-t pt-6 border-gray-100 dark:border-slate-700">
                <div className="flex justify-between text-gray-500">
                  <span>Subtotal</span>
                  <span>Rs. {cart?.subtotal.toLocaleString()}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-green-500 font-bold">
                    <span>Coupon Discount</span>
                    <span>-${discountAmount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-2xl font-extrabold border-t pt-3 border-gray-100 dark:border-slate-700">
                  <span>Total</span>
                  <span className="text-blue-600">Rs. {finalTotal.toLocaleString()}</span>
                </div>
              </div>

              <button 
                onClick={handlePlaceOrder}
                disabled={isLoading}
                className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-blue-500/30 hover:scale-[1.02] transition-all disabled:opacity-50"
              >
                {isLoading ? 'Processing...' : 'Complete Purchase'}
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
