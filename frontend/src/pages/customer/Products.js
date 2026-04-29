import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getProducts, getBrands } from '../../store/slices/productSlice';
import ProductCard from '../../components/common/ProductCard';
import { FiFilter, FiX, FiChevronDown, FiSearch } from 'react-icons/fi';

const Products = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const { products, brands, isLoading, pages, page: currentPage } = useSelector((state) => state.products);
  const { isDarkMode } = useSelector((state) => state.theme);

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  // Filter States
  const [filters, setFilters] = useState({
    brand: searchParams.get('brand') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    ram: searchParams.get('ram') || '',
    storage: searchParams.get('storage') || '',
    sort: searchParams.get('sort') || 'latest',
    keyword: searchParams.get('search') || '',
    inStock: searchParams.get('inStock') === 'true'
  });

  useEffect(() => {
    dispatch(getBrands());
  }, [dispatch]);

  useEffect(() => {
    const params = Object.fromEntries([...searchParams]);
    // Sync internal state with URL params (e.g., when searching from Header)
    setFilters(prev => ({
      ...prev,
      brand: params.brand || '',
      keyword: params.search || '',
      page: params.page || 1
    }));

    dispatch(getProducts({
      ...params,
      keyword: params.search,
      page: params.page || 1
    }));
  }, [dispatch, searchParams]);

  const handleFilterChange = (name, value) => {
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);
    
    const params = {};
    if (newFilters.brand) params.brand = newFilters.brand;
    if (newFilters.minPrice) params.minPrice = newFilters.minPrice;
    if (newFilters.maxPrice) params.maxPrice = newFilters.maxPrice;
    if (newFilters.ram) params.ram = newFilters.ram;
    if (newFilters.storage) params.storage = newFilters.storage;
    if (newFilters.sort) params.sort = newFilters.sort;
    if (newFilters.keyword) params.search = newFilters.keyword;
    if (newFilters.inStock) params.inStock = 'true';
    
    setSearchParams(params);
  };

  const handlePageChange = (newPage) => {
    const currentParams = Object.fromEntries([...searchParams]);
    setSearchParams({ ...currentParams, page: newPage });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const clearFilters = () => {
    setFilters({
      brand: '', minPrice: '', maxPrice: '', ram: '', storage: '', sort: 'latest', keyword: '', inStock: false
    });
    setSearchParams({});
  };

  return (
    <div className={`min-h-screen pt-24 pb-20 ${isDarkMode ? 'bg-slate-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Desktop Sidebar / Mobile Drawer */}
          <aside className={`lg:w-64 flex-shrink-0 ${isFilterOpen ? 'block' : 'hidden lg:block'}`}>
            <div className={`sticky top-24 p-6 rounded-3xl border ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'} shadow-sm`}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <FiFilter /> Filters
                </h2>
                <button onClick={clearFilters} className="text-sm text-blue-500 hover:underline">Clear All</button>
              </div>

              {/* Search within Category */}
              <div className="mb-6">
                <label className="text-sm font-semibold mb-2 block">Search</label>
                <div className="relative">
                  <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input 
                    type="text" 
                    value={filters.keyword}
                    onChange={(e) => handleFilterChange('keyword', e.target.value)}
                    className={`w-full pl-10 pr-4 py-2 rounded-xl text-sm border focus:ring-2 focus:ring-blue-500 outline-none ${isDarkMode ? 'bg-slate-700 border-slate-600' : 'bg-gray-50 border-gray-200'}`}
                    placeholder="Model name..."
                  />
                </div>
              </div>

              {/* Brand Filter */}
              <div className="mb-6">
                <label className="text-sm font-semibold mb-2 block">Brand</label>
                <select 
                  value={filters.brand}
                  onChange={(e) => handleFilterChange('brand', e.target.value)}
                  className={`w-full p-2 rounded-xl text-sm border focus:ring-2 focus:ring-blue-500 outline-none ${isDarkMode ? 'bg-slate-700 border-slate-600' : 'bg-gray-50 border-gray-200'}`}
                >
                  <option value="">All Brands</option>
                  {brands.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>

              {/* Price Filter */}
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

              {/* RAM Filter */}
              <div className="mb-6">
                <label className="text-sm font-semibold mb-2 block">RAM</label>
                <div className="grid grid-cols-2 gap-2">
                  {['4GB', '6GB', '8GB', '12GB', '16GB'].map(ram => (
                    <button
                      key={ram}
                      onClick={() => handleFilterChange('ram', filters.ram === ram ? '' : ram)}
                      className={`py-1.5 px-2 rounded-lg text-xs font-medium border transition-all ${
                        filters.ram === ram 
                          ? 'bg-blue-600 border-blue-600 text-white' 
                          : isDarkMode ? 'bg-slate-700 border-slate-600 hover:border-blue-500' : 'bg-gray-50 border-gray-200 hover:border-blue-500'
                      }`}
                    >
                      {ram}
                    </button>
                  ))}
                </div>
              </div>

              {/* Stock Toggle */}
              <div className="flex items-center gap-2 mt-4 cursor-pointer" onClick={() => handleFilterChange('inStock', !filters.inStock)}>
                <div className={`w-10 h-5 rounded-full relative transition-colors ${filters.inStock ? 'bg-green-500' : 'bg-gray-400'}`}>
                  <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${filters.inStock ? 'left-6' : 'left-1'}`}></div>
                </div>
                <span className="text-sm font-medium">In Stock Only</span>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {/* Toolbar */}
            <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 p-4 rounded-2xl ${isDarkMode ? 'bg-slate-800' : 'bg-white'} shadow-sm`}>
              <p className="text-sm font-medium text-gray-500">
                Showing <span className={isDarkMode ? 'text-white' : 'text-gray-900'}>{products.length}</span> products
              </p>
              
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <button 
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  className="lg:hidden flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-bold"
                >
                  <FiFilter /> Filters
                </button>
                
                <div className="flex items-center gap-2 ml-auto">
                  <span className="text-sm text-gray-500 whitespace-nowrap">Sort by:</span>
                  <select 
                    value={filters.sort}
                    onChange={(e) => handleFilterChange('sort', e.target.value)}
                    className={`p-2 rounded-xl text-sm border outline-none ${isDarkMode ? 'bg-slate-700 border-slate-600' : 'bg-gray-50 border-gray-200'}`}
                  >
                    <option value="latest">Latest Arrivals</option>
                    <option value="price_low">Price: Low to High</option>
                    <option value="price_high">Price: High to Low</option>
                    <option value="rating">Top Rated</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Product Grid */}
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className={`aspect-[3/4] rounded-3xl animate-pulse ${isDarkMode ? 'bg-slate-800' : 'bg-gray-200'}`}></div>
                ))}
              </div>
            ) : products.length > 0 ? (
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
                <h3 className="text-xl font-bold mb-2">No products found</h3>
                <p className="text-gray-500">Try adjusting your filters or search keywords.</p>
                <button onClick={clearFilters} className="mt-4 text-blue-500 font-bold hover:underline">Clear all filters</button>
              </div>
            )}

            {/* Pagination */}
            {pages > 1 && (
              <div className="flex justify-center gap-2 mt-12">
                {[...Array(pages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => handlePageChange(i + 1)}
                    className={`w-10 h-10 rounded-xl font-bold transition-all ${
                      currentPage === i + 1 
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

export default Products;