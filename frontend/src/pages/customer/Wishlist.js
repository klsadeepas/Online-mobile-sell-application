import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getProfile, removeFromWishlist } from '../../store/slices/authSlice';
import ProductCard from '../../components/common/ProductCard';
import { FiHeart, FiShoppingBag } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const Wishlist = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { isDarkMode } = useSelector((state) => state.theme);

  useEffect(() => {
    dispatch(getProfile());
  }, [dispatch]);

  if (!user?.wishlist?.length) {
    return (
      <div className={`min-h-[70vh] flex flex-col items-center justify-center ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
        <FiHeart size={80} className="text-gray-300 mb-6" />
        <h2 className="text-2xl font-bold mb-4">Your wishlist is empty</h2>
        <Link to="/products" className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold">Explore Phones</Link>
      </div>
    );
  }

  return (
    <div className={`min-h-screen pt-24 pb-20 ${isDarkMode ? 'bg-slate-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-extrabold mb-10 flex items-center gap-3">
          <FiHeart className="text-red-500 fill-red-500" /> My Wishlist
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {user.wishlist.map(product => (
            <div key={product._id} className="relative group">
              <ProductCard product={product} />
              <button 
                onClick={() => dispatch(removeFromWishlist(product._id))}
                className="absolute top-4 right-4 z-20 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all"
              >
                <FiHeart fill="white" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Wishlist;