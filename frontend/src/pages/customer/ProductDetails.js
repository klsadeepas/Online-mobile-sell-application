import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { getProductById, getRelatedProducts, reset } from '../../store/slices/productSlice';
import { addToCart } from '../../store/slices/cartSlice';
import { reviewAPI } from '../../utils/api';
import ProductCard from '../../components/common/ProductCard';
import { FiShoppingCart, FiHeart, FiShield, FiTruck, FiRefreshCw, FiStar, FiCheck } from 'react-icons/fi';
import { toast } from 'react-toastify';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { product, relatedProducts, isLoading, isError, message } = useSelector((state) => state.products);
  const { user } = useSelector((state) => state.auth);
  const { isDarkMode } = useSelector((state) => state.theme);

  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [reviews, setReviews] = useState([]);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });

  useEffect(() => {
    dispatch(getProductById(id));
    dispatch(getRelatedProducts(id));
    fetchReviews();

    return () => dispatch(reset());
  }, [dispatch, id]);

  useEffect(() => {
    if (isError) toast.error(message);
  }, [isError, message]);

  const fetchReviews = async () => {
    try {
      const { data } = await reviewAPI.getProductReviews(id);
      setReviews(data);
    } catch (error) {
      console.error('Failed to fetch reviews');
    }
  };

  const handleAddToCart = () => {
    if (!user) {
      toast.error('Please login to add to cart');
      navigate('/login');
      return;
    }
    dispatch(addToCart({ userId: user._id, productId: product._id, quantity }));
    toast.success('Added to cart!');
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) return toast.error('Login to leave a review');
    try {
      await reviewAPI.createReview({ productId: id, ...reviewForm });
      toast.success('Review submitted!');
      setReviewForm({ rating: 5, comment: '' });
      fetchReviews();
      dispatch(getProductById(id)); // Refresh product rating
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit review');
    }
  };

  if (isLoading || !product) {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
    </div>;
  }

  return (
    <div className={`min-h-screen pt-24 pb-20 ${isDarkMode ? 'bg-slate-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Product Info Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          {/* Image Gallery */}
          <div className="space-y-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`aspect-square rounded-3xl overflow-hidden border ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}
            >
              <img src={product.images[activeImage]} alt={product.name} className="w-full h-full object-contain p-8" />
            </motion.div>
            <div className="flex gap-4 overflow-x-auto pb-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  className={`w-20 h-20 flex-shrink-0 rounded-xl border-2 transition-all p-2 ${
                    activeImage === idx ? 'border-blue-600' : isDarkMode ? 'border-slate-700' : 'border-gray-200'
                  }`}
                >
                  <img src={img} alt="thumb" className="w-full h-full object-contain" />
                </button>
              ))}
            </div>
          </div>

          {/* Details */}
          <div className="flex flex-col">
            <div className="mb-6">
              <span className="text-blue-600 font-bold uppercase tracking-wider text-sm">{product.brand}</span>
              <h1 className="text-4xl font-extrabold mt-2 mb-4">{product.name}</h1>
              <div className="flex items-center gap-4">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => <FiStar key={i} fill={i < Math.round(product.rating) ? "currentColor" : "none"} />)}
                </div>
                <span className="text-gray-500">({product.numReviews} Reviews)</span>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${product.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                </span>
              </div>
            </div>

            <div className="mb-8">
              <div className="flex items-end gap-3">
                <span className="text-3xl font-bold">Rs. {product.price.toLocaleString()}</span>
                {product.originalPrice > product.price && (
                  <span className="text-xl text-gray-500 line-through mb-1">Rs. {product.originalPrice.toLocaleString()}</span>
                )}
              </div>
              <p className={`mt-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{product.description}</p>
            </div>

            {product.category === 'Smartphone' && product.specs && (
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className={`p-4 rounded-2xl border ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-100'}`}>
                  <p className="text-xs text-gray-500 uppercase font-bold">Storage</p>
                  <p className="font-semibold">{product.specs.storage}</p>
                </div>
                <div className={`p-4 rounded-2xl border ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-100'}`}>
                  <p className="text-xs text-gray-500 uppercase font-bold">RAM</p>
                  <p className="font-semibold">{product.specs.ram}</p>
                </div>
              </div>
            )}

            <div className="flex items-center gap-4 mt-auto">
              <div className={`flex items-center rounded-xl border ${isDarkMode ? 'border-slate-700' : 'border-gray-200'}`}>
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-4 py-3 hover:bg-blue-600 hover:text-white transition-colors rounded-l-xl">-</button>
                <span className="px-6 font-bold">{quantity}</span>
                <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))} className="px-4 py-3 hover:bg-blue-600 hover:text-white transition-colors rounded-r-xl">+</button>
              </div>
              <button 
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-500/30 transition-all disabled:opacity-50"
              >
                <FiShoppingCart /> Add to Cart
              </button>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="mb-20">
          <div className="flex border-b border-gray-200 dark:border-slate-700 mb-8">
            {['description', 'specifications', 'reviews'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-8 py-4 font-bold capitalize transition-all relative ${
                  activeTab === tab ? 'text-blue-600' : 'text-gray-500'
                }`}
              >
                {tab}
                {activeTab === tab && <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600" />}
              </button>
            ))}
          </div>

          <div className="min-h-[300px]">
            {activeTab === 'description' && (
              <div className="prose dark:prose-invert max-w-none">
                <p className="text-lg leading-relaxed opacity-80">{product.description}</p>
                <ul className="mt-8 space-y-3">
                  <li className="flex items-center gap-2"><FiCheck className="text-green-500" /> Original brand warranty</li>
                  <li className="flex items-center gap-2"><FiCheck className="text-green-500" /> Free delivery for orders over $500</li>
                  <li className="flex items-center gap-2"><FiCheck className="text-green-500" /> 30-days money back guarantee</li>
                </ul>
              </div>
            )}

            {activeTab === 'specifications' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {product.specs ? Object.entries(product.specs).map(([key, value]) => (
                  value && (
                    <div key={key} className={`flex justify-between p-4 rounded-xl ${isDarkMode ? 'bg-slate-800' : 'bg-gray-100'}`}>
                      <span className="text-gray-500 capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                      <span className="font-bold">{value}</span>
                    </div>
                  )
                )) : (
                  <p className="text-center text-gray-500 col-span-2">No technical specifications available for this item.</p>
                )}
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-12">
                {/* Review Form */}
                {user && (
                  <div className={`p-8 rounded-3xl ${isDarkMode ? 'bg-slate-800' : 'bg-white'} border ${isDarkMode ? 'border-slate-700' : 'border-gray-100'}`}>
                    <h3 className="text-xl font-bold mb-6">Write a Customer Review</h3>
                    <form onSubmit={handleReviewSubmit} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Rating</label>
                        <div className="flex gap-2">
                          {[1, 2, 3, 4, 5].map(star => (
                            <button 
                              key={star} 
                              type="button" 
                              onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                              className={`text-2xl ${reviewForm.rating >= star ? 'text-yellow-400' : 'text-gray-300'}`}
                            >
                              <FiStar fill={reviewForm.rating >= star ? "currentColor" : "none"} />
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Your Feedback</label>
                        <textarea 
                          value={reviewForm.comment}
                          onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                          className={`w-full p-4 rounded-xl border focus:ring-2 focus:ring-blue-500 outline-none ${
                            isDarkMode ? 'bg-slate-700 border-slate-600' : 'bg-gray-50 border-gray-200'
                          }`}
                          rows="4"
                          placeholder="Share your experience with this phone..."
                          required
                        />
                      </div>
                      <button className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all">
                        Submit Review
                      </button>
                    </form>
                  </div>
                )}

                {/* Review List */}
                <div className="space-y-6">
                  {reviews.length === 0 ? (
                    <p className="text-center text-gray-500 py-10">No reviews yet. Be the first to review!</p>
                  ) : (
                    reviews.map(review => (
                      <div key={review._id} className="border-b border-gray-100 dark:border-slate-700 pb-6">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="font-bold">{review.name}</p>
                            <div className="flex text-yellow-400 text-xs">
                              {[...Array(5)].map((_, i) => <FiStar key={i} fill={i < review.rating ? "currentColor" : "none"} />)}
                            </div>
                          </div>
                          <span className="text-xs text-gray-500">{new Date(review.createdAt).toLocaleDateString()}</span>
                        </div>
                        <p className="opacity-80">{review.comment}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold mb-8">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {relatedProducts.map(prod => (
                <ProductCard key={prod._id} product={prod} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;