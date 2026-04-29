import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getProducts, deleteProduct } from '../../store/slices/productSlice';
import { FiEdit, FiTrash2, FiPlus, FiSmartphone, FiSearch } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import ProductForm from '../../components/admin/ProductForm';

const AdminProducts = () => {
  const dispatch = useDispatch();
  const { products, isLoading, pages, page: currentPage } = useSelector((state) => state.products);
  const { isDarkMode } = useSelector((state) => state.theme);

  const [showForm, setShowForm] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    dispatch(getProducts({ page, keyword: searchKeyword }));
  }, [dispatch, page, searchKeyword]);

  const handleAddProduct = () => {
    setEditingProductId(null);
    setShowForm(true);
  };

  const handleEditProduct = (id) => {
    setEditingProductId(id);
    setShowForm(true);
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await dispatch(deleteProduct(id)).unwrap();
        toast.success('Product deleted successfully!');
        dispatch(getProducts({ page, keyword: searchKeyword })); // Refresh list
      } catch (error) {
        toast.error(error || 'Failed to delete product');
      }
    }
  };

  const handleSaveSuccess = () => {
    dispatch(getProducts({ page, keyword: searchKeyword })); // Refresh list
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  return (
    <div className={`min-h-screen pt-24 pb-20 ${isDarkMode ? 'bg-slate-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-extrabold flex items-center gap-3">
            <FiSmartphone className="text-blue-500" /> Product Management
          </h1>
          <button
            onClick={handleAddProduct}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all flex items-center gap-2"
          >
            <FiPlus /> Add Product
          </button>
        </div>

        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mb-8 overflow-hidden"
            >
              <ProductForm
                productId={editingProductId}
                onClose={() => setShowForm(false)}
                onSaveSuccess={handleSaveSuccess}
              />
            </motion.div>
          )}
        </AnimatePresence>

        <div className={`p-6 rounded-3xl border ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-100'} shadow-sm`}>
          <div className="mb-6 flex justify-between items-center">
            <div className="relative w-full max-w-md">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                className={`w-full pl-10 pr-4 py-2 rounded-xl border focus:ring-2 focus:ring-blue-500 outline-none ${isDarkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-gray-50 border-gray-200'}`}
              />
            </div>
          </div>

          {isLoading ? (
            <div className="text-center py-10">
              <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-700">
                  <thead className={`${isDarkMode ? 'bg-slate-700' : 'bg-gray-50'}`}>
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Brand</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
                    {products.map((product) => (
                      <tr key={product._id} className={isDarkMode ? 'hover:bg-slate-700' : 'hover:bg-gray-50'}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <img src={product.images[0]} alt={product.name} className="h-10 w-10 rounded-md object-cover" />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{product.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">{product.brand}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">${product.price.toLocaleString()}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">{product.stock}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleEditProduct(product._id)}
                              className="text-blue-600 hover:text-blue-900 p-2 rounded-full hover:bg-blue-100 dark:hover:bg-slate-700"
                            >
                              <FiEdit size={18} />
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(product._id)}
                              className="text-red-600 hover:text-red-900 p-2 rounded-full hover:bg-red-100 dark:hover:bg-slate-700"
                            >
                              <FiTrash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {pages > 1 && (
                <div className="flex justify-center gap-2 mt-8">
                  {[...Array(pages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => handlePageChange(i + 1)}
                      className={`w-10 h-10 rounded-xl font-bold transition-all ${
                        currentPage === i + 1
                          ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                          : isDarkMode ? 'bg-slate-700 hover:bg-slate-600' : 'bg-white border border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminProducts;