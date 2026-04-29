import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { FiShoppingCart, FiHeart, FiEye, FiStar } from 'react-icons/fi';
import { addToCart } from '../../store/slices/cartSlice';
import { addToWishlist as addToWishlistAPI } from '../../store/slices/authSlice';
import { toast } from 'react-toastify';

const ProductCard = ({ product, isAdmin = false }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { isDarkMode } = useSelector((state) => state.theme);

  const handleAddToCart = (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please login to add to cart');
      return;
    }
    dispatch(addToCart({ userId: user._id, productId: product._id, quantity: 1 }));
    toast.success('Added to cart!');
  };

  const handleAddToWishlist = (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please login to add to wishlist');
      return;
    }
    dispatch(addToWishlistAPI(product._id));
    toast.success('Added to wishlist!');
  };

  // Use discountPercentage directly from the product object
  const discountPercentage = product.discountPercentage || 0;

  return (
    <Link
      to={`/products/${product._id}`}
      className={`group relative rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl ${
        isDarkMode ? 'bg-slate-800 hover:bg-slate-750' : 'bg-white hover:bg-white'
      } shadow-lg`}
    >
      {/* Badge */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
        {product.isFlashSale && (
          <span className="px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full animate-pulse">
            🔥 Flash Sale
          </span>
        )} 
        {discountPercentage > 0 && ( // Display discount percentage if greater than 0
          <span className="px-3 py-1 bg-green-500 text-white text-xs font-bold rounded-full">
            -{discountPercentage}%
          </span>
        )}
        {product.isFeatured && (
          <span className="px-3 py-1 bg-blue-500 text-white text-xs font-bold rounded-full">
            ⭐ Featured
          </span>
        )}
      </div>

      {/* Wishlist Button */}
      {!isAdmin && (
        <button
          onClick={handleAddToWishlist}
          className={`absolute top-3 right-3 z-10 p-2 rounded-full transition-all duration-300 ${
            isDarkMode ? 'bg-slate-700 text-gray-300 hover:bg-slate-600' : 'bg-white text-gray-600 hover:bg-gray-100'
          } shadow-md hover:shadow-lg opacity-0 group-hover:opacity-100`}
        >
          <FiHeart size={18} />
        </button>
      )}

      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        <img
          src={product.images?.[0] || 'https://via.placeholder.com/400'}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {/* Quick View Overlay */}
        <div className={`absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300`}>
          <div className="flex gap-2">
            <button
              onClick={handleAddToCart}
              className="p-3 bg-white rounded-full text-gray-900 hover:bg-blue-600 hover:text-white transition-all duration-300 transform translate-y-4 group-hover:translate-y-0"
            >
              <FiShoppingCart size={20} />
            </button>
            <Link
              to={`/products/${product._id}`}
              className="p-3 bg-white rounded-full text-gray-900 hover:bg-purple-600 hover:text-white transition-all duration-300 transform translate-y-4 group-hover:translate-y-0"
              style={{ transitionDelay: '50ms' }}
            >
              <FiEye size={20} />
            </Link>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Brand */}
        <p className={`text-xs font-medium mb-1 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
          {product.brand}
        </p>

        {/* Name */}
        <h3 className={`font-semibold text-sm mb-2 line-clamp-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          {product.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <FiStar
                key={i}
                size={14}
                className={i < Math.round(product.rating || 0) ? 'text-yellow-400 fill-current' : 'text-gray-300'}
              />
            ))}
          </div>
          <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            ({product.numReviews || 0})
          </span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2">
          <span className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Rs. {product.price?.toLocaleString()}
          </span>
          {product.originalPrice && product.originalPrice > product.price && (
            <span className={`text-sm line-through ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
              Rs. {product.originalPrice?.toLocaleString()}
            </span>
          )}
        </div>

        {/* Specs Preview */}
        {product.specs && (
          <div className={`mt-3 pt-3 border-t text-xs ${isDarkMode ? 'border-slate-700 text-gray-400' : 'border-gray-200 text-gray-500'}`}>
            <div className="flex gap-3">
              {product.specs.ram && <span>📱 {product.specs.ram}</span>}
              {product.specs.storage && <span>💾 {product.specs.storage}</span>}
            </div>
          </div>
        )}
      </div>
    </Link>
  );
};

export default ProductCard;