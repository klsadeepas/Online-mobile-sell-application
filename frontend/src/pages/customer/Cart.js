import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { getCart, updateCartItem, removeFromCart } from '../../store/slices/cartSlice';
import { FiTrash2, FiMinus, FiPlus, FiArrowRight, FiShoppingCart, FiShoppingBag } from 'react-icons/fi';
import { toast } from 'react-toastify';

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { cart, isLoading } = useSelector((state) => state.cart);
  const { isDarkMode } = useSelector((state) => state.theme);

  useEffect(() => {
    if (user) {
      dispatch(getCart(user._id));
    }
  }, [dispatch, user]);

  const handleQuantityUpdate = (itemId, newQty, stock) => {
    if (newQty < 1) return;
    if (newQty > stock) {
      toast.error('Not enough stock available');
      return;
    }
    dispatch(updateCartItem({ userId: user._id, itemId, quantity: newQty }));
  };

  const handleRemove = (itemId) => {
    dispatch(removeFromCart({ userId: user._id, itemId }));
    toast.success('Item removed from cart');
  };

  if (!user) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-4">
        <FiShoppingBag size={80} className="text-gray-300 mb-6" />
        <h2 className="text-2xl font-bold mb-4">Please login to see your cart</h2>
        <Link to="/login" className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold">Login Now</Link>
      </div>
    );
  }

  if (isLoading && !cart) {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
    </div>;
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-4">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="p-8 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 mb-6">
          <FiShoppingCart size={60} />
        </motion.div>
        <h2 className={`text-3xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Your cart is empty</h2>
        <p className="text-gray-500 mb-8">Looks like you haven't added anything to your cart yet.</p>
        <Link to="/products" className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-2xl font-bold shadow-lg shadow-blue-500/30 hover:scale-105 transition-all">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className={`min-h-screen pt-24 pb-20 ${isDarkMode ? 'bg-slate-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-extrabold mb-10 flex items-center gap-3">
          <FiShoppingBag /> Shopping Cart ({cart.items.length})
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Cart Items List */}
          <div className="lg:col-span-2 space-y-6">
            <AnimatePresence mode="popLayout">
              {cart.items.map((item) => (
                <motion.div
                  key={item._id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className={`p-6 rounded-3xl border flex flex-col sm:flex-row items-center gap-6 ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-100'} shadow-sm`}
                >
                  <Link to={`/products/${item.product._id}`} className="w-24 h-24 flex-shrink-0 bg-gray-100 rounded-2xl p-2">
                    <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                  </Link>
                  
                  <div className="flex-1 text-center sm:text-left">
                    <Link to={`/products/${item.product._id}`} className="font-bold text-lg hover:text-blue-500 transition-colors line-clamp-1">{item.name}</Link>
                    <p className="text-blue-600 font-bold mt-1">${item.price.toLocaleString()}</p>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className={`flex items-center rounded-xl border ${isDarkMode ? 'border-slate-700' : 'border-gray-200'}`}>
                      <button onClick={() => handleQuantityUpdate(item._id, item.quantity - 1, item.product.stock)} className="px-3 py-2 hover:bg-red-500 hover:text-white transition-colors rounded-l-xl"><FiMinus size={14}/></button>
                      <span className="px-4 font-bold text-sm w-12 text-center">{item.quantity}</span>
                      <button onClick={() => handleQuantityUpdate(item._id, item.quantity + 1, item.product.stock)} className="px-3 py-2 hover:bg-green-500 hover:text-white transition-colors rounded-r-xl"><FiPlus size={14}/></button>
                    </div>
                    <button 
                      onClick={() => handleRemove(item._id)}
                      className={`p-3 rounded-xl transition-all ${isDarkMode ? 'bg-slate-700 text-red-400 hover:bg-red-500 hover:text-white' : 'bg-gray-100 text-red-500 hover:bg-red-500 hover:text-white'}`}
                    >
                      <FiTrash2 />
                    </button>
                  </div>

                  <div className="text-right min-w-[100px] hidden sm:block">
                    <p className="text-xs text-gray-500 uppercase font-bold">Total</p>
                    <p className="font-extrabold text-lg">${item.totalPrice.toLocaleString()}</p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className={`sticky top-24 p-8 rounded-3xl border ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-100'} shadow-lg`}>
              <h3 className="text-xl font-bold mb-6">Order Summary</h3>
              
              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-gray-500">
                  <span>Subtotal</span>
                  <span className={isDarkMode ? 'text-white' : 'text-gray-900'}>${cart.subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Tax (10%)</span>
                  <span className={isDarkMode ? 'text-white' : 'text-gray-900'}>${cart.tax.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-500 pb-4 border-b border-gray-100 dark:border-slate-700">
                  <span>Shipping</span>
                  <span className={cart.shipping === 0 ? 'text-green-500 font-bold' : isDarkMode ? 'text-white' : 'text-gray-900'}>
                    {cart.shipping === 0 ? 'FREE' : `$${cart.shipping}`}
                  </span>
                </div>
                <div className="flex justify-between text-xl font-extrabold">
                  <span>Total</span>
                  <span className="text-blue-600">${cart.total.toLocaleString()}</span>
                </div>
              </div>

              <button 
                onClick={() => navigate('/checkout')}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-blue-500/30 hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
              >
                Proceed to Checkout <FiArrowRight />
              </button>

              <div className="mt-8 space-y-4">
                <div className="flex items-center gap-3 text-xs text-gray-500">
                  <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center flex-shrink-0">
                    <FiShoppingBag size={14} />
                  </div>
                  <p>Secure SSL encrypted checkout</p>
                </div>
                {cart.subtotal < 500 && (
                  <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-xs text-blue-600 dark:text-blue-400">
                    Add <b>${(500 - cart.subtotal).toLocaleString()}</b> more to your cart for <b>FREE shipping!</b>
                  </div>
                )}
              </div>
            </div>
            
            <Link to="/products" className="mt-6 flex items-center justify-center gap-2 text-sm font-bold text-gray-500 hover:text-blue-600 transition-colors">
              <FiMinus /> Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;