import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { getFeaturedProducts, getFlashSaleProducts } from '../../store/slices/productSlice';
import Hero from '../../components/home/Hero';
import ProductCard from '../../components/common/ProductCard';
import { FiZap, FiStar, FiAward, FiTruck, FiShield, FiRefreshCw } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const Home = () => {
  const dispatch = useDispatch();
  const { featuredProducts, flashSaleProducts, isLoading } = useSelector((state) => state.products);
  const { isDarkMode } = useSelector((state) => state.theme);

  useEffect(() => {
    dispatch(getFeaturedProducts());
    dispatch(getFlashSaleProducts());
  }, [dispatch]);

  const brands = [
    { name: 'Apple', logo: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg' },
    { name: 'Samsung', logo: 'https://upload.wikimedia.org/wikipedia/commons/2/24/Samsung_Logo.svg' },
    { name: 'Xiaomi', logo: 'https://upload.wikimedia.org/wikipedia/commons/a/ae/Xiaomi_logo_%282021-%29.svg' },
    { name: 'OnePlus', logo: 'https://upload.wikimedia.org/wikipedia/commons/3/30/OnePlus_logo.svg' },
    { name: 'Google Pixel', logo: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg' }
  ];

  return (
    <div className="pb-20">
      <Hero />

      {/* Features Section */}
      <section className="py-12 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { icon: FiTruck, title: 'Free Delivery', desc: 'On orders over $500' },
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
          <div className="flex flex-wrap justify-center items-center gap-12 opacity-60 hover:opacity-100 transition-opacity">
            {brands.map((brand, index) => (
              <Link key={index} to={`/products?brand=${brand.name}`} className="h-12 w-32 flex items-center justify-center grayscale hover:grayscale-0 transition-all">
                <img src={brand.logo} alt={brand.name} className={`max-h-full ${isDarkMode ? 'invert' : ''}`} />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 max-w-7xl mx-auto px-4">
        <div className="flex flex-col items-center mb-16">
          <div className="flex items-center gap-2 text-blue-600 font-bold tracking-widest uppercase text-sm mb-4">
            <FiStar /> Our Picks <FiStar />
          </div>
          <h2 className={`text-4xl font-extrabold text-center ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Featured Smartphones
          </h2>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[...Array(8)].map((_, i) => (
              <div key={i} className={`h-96 rounded-2xl animate-pulse ${isDarkMode ? 'bg-slate-800' : 'bg-gray-200'}`}></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map(product => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;