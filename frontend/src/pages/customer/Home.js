import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { getFeaturedProducts, getFlashSaleProducts } from '../../store/slices/productSlice';
import Hero from '../../components/home/Hero';
import ProductCard from '../../components/common/ProductCard';
import { FiZap, FiStar, FiAward, FiTruck, FiShield, FiRefreshCw } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { SiApple, SiSamsung, SiXiaomi, SiOneplus, SiGoogle } from 'react-icons/si';

const Home = () => {
  const dispatch = useDispatch();
  const { featuredProducts, flashSaleProducts, isLoading } = useSelector((state) => state.products);
  const { isDarkMode } = useSelector((state) => state.theme);

  useEffect(() => {
    dispatch(getFeaturedProducts());
    dispatch(getFlashSaleProducts());
  }, [dispatch]);

  const brands = [
    { name: 'Apple', icon: SiApple },
    { name: 'Samsung', icon: SiSamsung },
    { name: 'Xiaomi', icon: SiXiaomi },
    { name: 'OnePlus', icon: SiOneplus },
    { name: 'Google Pixel', icon: SiGoogle }
  ];

  return (
    <div className="pb-20">
      <Hero />

      {/* Features Section */}
      <section className="py-12 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { icon: FiTruck, title: 'Free Delivery', desc: 'On orders over RS.50, 000' },
            { icon: FiShield, title: 'Secure Payment', desc: '100% secure processing' },
            { icon: FiAward, title: 'Official Warranty', desc: 'Authorized resellers' },
            { icon: FiRefreshCw, title: 'Easy Returns', desc: '30-day money back' }
          ].map((item, index) => (
            <div key={index} className="flex flex-col items-center text-center text-white">
              <item.icon size={32} className="mb-3 opacity-90" />
              <h3 className="font-bold">{item.title}</h3>
              <p className="text-xs opacity-70">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Flash Sale Section */}
      {flashSaleProducts.length > 0 && (
        <section className="py-20 max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-red-500 rounded-2xl text-white">
                <FiZap size={24} />
              </div>
              <div>
                <h2 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Flash Sales</h2>
                <p className="text-red-500 font-medium text-sm">Limited time offers</p>
              </div>
            </div>
            <Link to="/products?isFlashSale=true" className="text-blue-600 font-semibold hover:underline">View All</Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {flashSaleProducts.map(product => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* Brand Showcase */}
      <section className={`py-16 ${isDarkMode ? 'bg-slate-800/50' : 'bg-gray-100'}`}>
        <div className="max-w-7xl mx-auto px-4">
          <h2 className={`text-2xl font-bold text-center mb-12 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Shop by Brand</h2>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
            {brands.map((brand, index) => (
              <Link key={index} to={`/products?brand=${brand.name}`} className="relative group">
                <motion.div
                  initial={{ scale: 0, opacity: 0, y: 50 }}
                  whileInView={{ scale: 1, opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ 
                    type: 'spring', 
                    stiffness: 400, 
                    damping: 15, 
                    delay: index * 0.1 
                  }}
                  whileHover={{ 
                    y: -15,
                    transition: { type: 'spring', stiffness: 400, damping: 10 }
                  }}
                  className={`flex flex-col items-center justify-center p-8 rounded-[2rem] transition-all duration-300 cursor-pointer relative ${
                    isDarkMode 
                      ? 'text-gray-400 hover:text-white hover:bg-slate-700/50' 
                      : 'text-gray-500 hover:text-blue-600 hover:bg-white hover:shadow-2xl hover:shadow-blue-500/10'
                  }`}
                >
                  {/* Top-up Badge Anime */}
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.5 }}
                    whileHover={{ opacity: 1, y: -45, scale: 1 }}
                    className="absolute top-0 px-3 py-1 bg-blue-600 text-white text-[10px] font-black rounded-full shadow-lg shadow-blue-500/50 pointer-events-none tracking-tighter"
                  >
                    TOP BRAND
                  </motion.div>

                  <brand.icon size={60} className="mb-4 drop-shadow-xl transition-transform duration-300 group-hover:scale-110" />
                  <span className="font-black text-sm tracking-widest uppercase">{brand.name}</span>
                  
                  {/* Decorative Glow */}
                  <div className={`absolute inset-0 rounded-[2rem] opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-2xl -z-10 ${isDarkMode ? 'bg-blue-500/10' : 'bg-blue-500/5'}`}></div>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      
    </div>
  );
};

export default Home;