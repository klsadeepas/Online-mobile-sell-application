import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getProducts } from '../../store/slices/productSlice';
import ProductCard from '../../components/common/ProductCard';
import { FiFilter, FiSearch } from 'react-icons/fi';

const Components = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const productState = useSelector((state) => state.products);
  const { isDarkMode } = useSelector((state) => state.theme);

  const products = (Array.isArray(productState?.products)
    ? productState.products
    : (productState?.products?.products || [])).filter(p => p.category === 'Component');

  const isLoading = productState?.isLoading;
  const pages = productState?.pages || productState?.products?.pages || 1;
  const currentPage = productState?.page || productState?.products?.page || 1;

  const [filters, setFilters] = useState({
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    sort: searchParams.get('sort') || 'latest',
    keyword: searchParams.get('search') || '',
  });

  useEffect(() => {
    const params = Object.fromEntries([...searchParams]);
    const queryParams = { ...params, category: 'Component', page: params.page || 1 };
    if (params.search) queryParams.keyword = params.search;

    dispatch(getProducts(queryParams));
  }, [dispatch, searchParams]);

  const handleFilterChange = (name, value) => {
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);

    const params = { category: 'Component' };
    if (newFilters.minPrice) params.minPrice = newFilters.minPrice;
    if (newFilters.maxPrice) params.maxPrice = newFilters.maxPrice;
    if (newFilters.sort) params.sort = newFilters.sort;
    if (newFilters.keyword) params.search = newFilters.keyword;

    setSearchParams(params);
  };

  const handlePageChange = (newPage) => {
    const currentParams = Object.fromEntries([...searchParams]);
    setSearchParams({ ...currentParams, page: newPage });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className={`min-h-screen pt-24 pb-20 ${isDarkMode ? 'bg-slate-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-extrabold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Mobile Components
          </h1>
          <p className={`text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            High-quality headphones, cables, memory cards, and more.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className={`sticky top-24 p-6 rounded-3xl border ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'} shadow-sm`}>
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <FiFilter /> Filters
              </h2>

              <div className="mb-6">
                <label className="text-sm font-semibold mb-2 block">Search Components</label>
                <div className="relative">
                  <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={filters.keyword}
                    onChange={(e) => handleFilterChange('keyword', e.target.value)}
                    className={`w-full pl-10 pr-4 py-2 rounded-xl text-sm border focus:ring-2 focus:ring-blue-500 outline-none ${isDarkMode ? 'bg-slate-700 border-slate-600' : 'bg-gray-50 border-gray-200'}`}
                    placeholder="Search..."
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="text-sm font-semibold mb-2 block">Price Range</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={filters.minPrice}
                    onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                    className={`w-1/2 p-2 rounded-xl text-sm border ${isDarkMode ? 'bg-slate-700 border-slate-600' : 'bg-gray-50 border-gray-200'}`}
                  />
                  <span>-</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={filters.maxPrice}
                    onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                    className={`w-1/2 p-2 rounded-xl text-sm border ${isDarkMode ? 'bg-slate-700 border-slate-600' : 'bg-gray-50 border-gray-200'}`}
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="text-sm font-semibold mb-2 block">Sort By</label>
                <select
                  value={filters.sort}
                  onChange={(e) => handleFilterChange('sort', e.target.value)}
                  className={`w-full p-2 rounded-xl text-sm border outline-none ${isDarkMode ? 'bg-slate-700 border-slate-600' : 'bg-gray-50 border-gray-200'}`}
                >
                  <option value="latest">Latest Arrivals</option>
                  <option value="price_low">Price: Low to High</option>
                  <option value="price_high">Price: High to Low</option>
                  <option value="rating">Top Rated</option>
                </select>
              </div>
            </div>
          </aside>

          {/* Main Grid */}
          <main className="flex-1">
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className={`aspect-[3/4] rounded-3xl animate-pulse ${isDarkMode ? 'bg-slate-800' : 'bg-gray-200'}`}></div>
                ))}
              </div>
            ) : products && products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                <AnimatePresence mode="popLayout">
                  {products.map((product) => (
                    <motion.div
                      key={product._id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ProductCard product={product} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            ) : (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-bold mb-2">No components found</h3>
                <p className="text-gray-500">Try adjusting your filters or search keywords.</p>
              </div>
            )}

            {/* Pagination */}
            {pages > 1 && (
              <div className="flex justify-center gap-2 mt-12">
                {[...Array(pages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => handlePageChange(i + 1)}
                    className={`w-10 h-10 rounded-xl font-bold transition-all ${currentPage === i + 1
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                      : isDarkMode ? 'bg-slate-800 hover:bg-slate-700' : 'bg-white border border-gray-200 hover:bg-gray-50'
                      }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Components;
