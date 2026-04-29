import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiSmartphone } from 'react-icons/fi';
import { useSelector } from 'react-redux';

const heroImages = [
  'https://images.unsplash.com/photo-1616348436168-de43ad0db179?q=80&w=800',
  'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?q=80&w=800',
  'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?q=80&w=800',
  'https://images.unsplash.com/photo-1591337676887-a217a6970a8a?q=80&w=800',
  'https://images.unsplash.com/photo-1605236453806-6ff36851218e?q=80&w=800',
  'https://images.unsplash.com/photo-1544228428-c11d2179b362?q=80&w=800'
];

const Hero = () => {
  const { isDarkMode } = useSelector((state) => state.theme);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative overflow-hidden pt-16 pb-20 lg:pt-32 lg:pb-40">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/20 blur-[120px] animate-pulse-slow"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-600/20 blur-[120px] animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Text Content */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="flex-1 text-center lg:text-left"
          >
            <span className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-semibold bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 mb-6">
              <FiSmartphone className="mr-2" /> New Arrivals 2026
            </span>
            <h1 className={`text-5xl lg:text-7xl font-extrabold mb-6 leading-tight ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Experience the <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">Future</span> of Mobile
            </h1>
            <p className={`text-lg mb-10 max-w-2xl mx-auto lg:mx-0 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Explore our collection of the world's most advanced smartphones. From stunning displays to professional cameras, find the device that defines you.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link 
                to="/products"
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full font-bold shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-105 transition-all flex items-center group"
              >
                Shop Collection
                <FiArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link 
                to="/products?isFlashSale=true"
                className={`px-8 py-4 rounded-full font-bold border-2 transition-all ${
                  isDarkMode ? 'border-slate-700 text-white hover:bg-slate-800' : 'border-gray-200 text-gray-900 hover:bg-gray-50'
                }`}
              >
                View Flash Sales
              </Link>
            </div>
          </motion.div>

          {/* Image Content */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="flex-1 relative"
          >
            <div className="relative z-10 w-full max-w-[500px] mx-auto aspect-[3/4] rounded-[3rem] shadow-2xl overflow-hidden bg-gray-100 dark:bg-slate-800">
              <AnimatePresence mode="wait">
                <motion.img
                  key={currentImageIndex}
                  src={heroImages[currentImageIndex]}
                  alt={`Smartphone ${currentImageIndex + 1}`}
                  initial={{ opacity: 0, scale: 1.1 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.8, ease: "easeInOut" }}
                  className="w-full h-full object-cover absolute top-0 left-0"
                />
              </AnimatePresence>
            </div>
            {/* Floating Spec Tags */}
            <motion.div animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 4 }} className="absolute top-1/4 -left-10 z-20 bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-xl border border-gray-100 dark:border-slate-700">
              <p className="text-xs font-bold text-blue-600">A17 Pro Chip</p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;