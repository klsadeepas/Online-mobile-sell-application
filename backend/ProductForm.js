import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createProduct, updateProduct, getProductById, reset } from '../../store/slices/productSlice';
import { uploadAPI } from '../../utils/api';
import { FiUpload, FiX, FiPlus, FiSave, FiSmartphone } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';

const ProductForm = ({ productId, onClose, onSaveSuccess }) => {
  const dispatch = useDispatch();
  const { product, isLoading, isError, message } = useSelector((state) => state.products);
  const { isDarkMode } = useSelector((state) => state.theme);

  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    description: '',
    price: '',
    discountPercentage: '',
    images: [],
    stock: '',
    specs: {
      storage: '',
      ram: '',
      processor: '',
      camera: '',
      battery: '',
      displaySize: '',
      os: ''
    },
    isFeatured: false,
    isFlashSale: false,
    flashSaleEnd: ''
  });
  const [imageFiles, setImageFiles] = useState([]);
  const [uploading, setUploading] = useState(false);

  const brands = ['Apple', 'Samsung', 'Xiaomi', 'OnePlus', 'Google Pixel', 'Oppo', 'Vivo', 'Realme'];
  const ramOptions = ['4GB', '6GB', '8GB', '12GB', '16GB'];
  const storageOptions = ['64GB', '128GB', '256GB', '512GB', '1TB'];

  useEffect(() => {
    if (productId) {
      dispatch(getProductById(productId));
    }
    return () => dispatch(reset());
  }, [dispatch, productId]);

  useEffect(() => {
    if (product && productId) {
      setFormData({
        name: product.name,
        brand: product.brand,
        description: product.description,
        price: product.price,
        discountPercentage: product.discountPercentage,
        images: product.images,
        stock: product.stock,
        specs: product.specs,
        isFeatured: product.isFeatured,
        isFlashSale: product.isFlashSale,
        flashSaleEnd: product.flashSaleEnd ? new Date(product.flashSaleEnd).toISOString().slice(0, 16) : ''
      });
    }
  }, [product, productId]);

  useEffect(() => {
    if (isError) toast.error(message);
  }, [isError, message]);

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.startsWith('specs.')) {
      const specKey = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        specs: { ...prev.specs, [specKey]: value }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    const uploadFormData = new FormData();
    files.forEach(file => uploadFormData.append('images', file));

    setUploading(true);
    try {
      const { data } = await uploadAPI.uploadImage(uploadFormData);
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...data]
      }));
      setImageFiles([]); // Clear file input
      toast.success('Images uploaded successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Image upload failed');
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      if (productId) {
        await dispatch(updateProduct({ id: productId, productData: formData })).unwrap();
        toast.success('Product updated successfully!');
      } else {
        await dispatch(createProduct(formData)).unwrap();
        toast.success('Product created successfully!');
      }
      onSaveSuccess();
      onClose();
    } catch (error) {
      toast.error(error || 'Failed to save product');
    }
  };

  const inputClass = `w-full p-3 rounded-xl border focus:ring-2 focus:ring-blue-500 outline-none ${isDarkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-gray-50 border-gray-200'}`;
  const labelClass = `block text-sm font-bold mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className={`p-8 rounded-3xl border ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-100'} shadow-xl`}
    >
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <FiSmartphone className="text-blue-500" /> {productId ? 'Edit Product' : 'Add New Product'}
      </h2>
      <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Info */}
        <div>
          <label className={labelClass}>Name</label>
          <input type="text" name="name" value={formData.name} onChange={onChange} className={inputClass} required />
        </div>
        <div>
          <label className={labelClass}>Brand</label>
          <select name="brand" value={formData.brand} onChange={onChange} className={inputClass} required>
            <option value="">Select Brand</option>
            {brands.map(b => <option key={b} value={b}>{b}</option>)}
          </select>
        </div>
        <div className="md:col-span-2">
          <label className={labelClass}>Description</label>
          <textarea name="description" value={formData.description} onChange={onChange} className={`${inputClass} h-24`} required></textarea>
        </div>
        <div>
          <label className={labelClass}>Price ($)</label>
          <input type="number" name="price" value={formData.price} onChange={onChange} className={inputClass} required min="0" step="0.01" />
        </div>
        <div>
          <label className={labelClass}>Discount (%)</label>
          <input type="number" name="discountPercentage" value={formData.discountPercentage} onChange={onChange} className={inputClass} min="0" max="100" />
        </div>
        <div>
          <label className={labelClass}>Stock</label>
          <input type="number" name="stock" value={formData.stock} onChange={onChange} className={inputClass} required min="0" />
        </div>

        {/* Specs */}
        <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 border-t border-b py-6 my-4 border-gray-200 dark:border-slate-700">
          <h3 className="col-span-full text-lg font-bold mb-2">Specifications</h3>
          <div>
            <label className={labelClass}>Storage</label>
            <select name="specs.storage" value={formData.specs.storage} onChange={onChange} className={inputClass} required>
              <option value="">Select Storage</option>
              {storageOptions.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className={labelClass}>RAM</label>
            <select name="specs.ram" value={formData.specs.ram} onChange={onChange} className={inputClass} required>
              <option value="">Select RAM</option>
              {ramOptions.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <div>
            <label className={labelClass}>Processor</label>
            <input type="text" name="specs.processor" value={formData.specs.processor} onChange={onChange} className={inputClass} required />
          </div>
          <div>
            <label className={labelClass}>Camera</label>
            <input type="text" name="specs.camera" value={formData.specs.camera} onChange={onChange} className={inputClass} required />
          </div>
          <div>
            <label className={labelClass}>Battery</label>
            <input type="text" name="specs.battery" value={formData.specs.battery} onChange={onChange} className={inputClass} required />
          </div>
          <div>
            <label className={labelClass}>Display Size</label>
            <input type="text" name="specs.displaySize" value={formData.specs.displaySize} onChange={onChange} className={inputClass} required />
          </div>
          <div>
            <label className={labelClass}>OS</label>
            <input type="text" name="specs.os" value={formData.specs.os} onChange={onChange} className={inputClass} required />
          </div>
        </div>

        {/* Images */}
        <div className="md:col-span-2">
          <label className={labelClass}>Images</label>
          <div className="flex flex-wrap gap-3 mb-4">
            <AnimatePresence>
              {formData.images.map((img, index) => (
                <motion.div
                  key={img}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="relative w-24 h-24 rounded-lg overflow-hidden border border-gray-200 dark:border-slate-700"
                >
                  <img src={img} alt={`Product Image ${index + 1}`} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 text-xs hover:bg-red-600"
                  >
                    <FiX />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
            <label className={`w-24 h-24 flex items-center justify-center rounded-lg border-2 border-dashed cursor-pointer transition-colors ${isDarkMode ? 'border-slate-600 hover:border-blue-500 text-gray-400' : 'border-gray-300 hover:border-blue-500 text-gray-500'}`}>
              {uploading ? (
                <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <FiPlus size={24} />
              )}
              <input type="file" multiple onChange={handleImageUpload} className="hidden" accept="image/*" />
            </label>
          </div>
        </div>

        {/* Checkboxes */}
        <div className="md:col-span-2 flex items-center gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" name="isFeatured" checked={formData.isFeatured} onChange={onChange} className="form-checkbox h-5 w-5 text-blue-600 rounded" />
            <span className={labelClass}>Featured Product</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" name="isFlashSale" checked={formData.isFlashSale} onChange={onChange} className="form-checkbox h-5 w-5 text-red-600 rounded" />
            <span className={labelClass}>Flash Sale</span>
          </label>
        </div>
        {formData.isFlashSale && (
          <div className="md:col-span-2">
            <label className={labelClass}>Flash Sale End Date</label>
            <input type="datetime-local" name="flashSaleEnd" value={formData.flashSaleEnd} onChange={onChange} className={inputClass} />
          </div>
        )}

        {/* Action Buttons */}
        <div className="md:col-span-2 flex justify-end gap-4 mt-6">
          <button
            type="button"
            onClick={onClose}
            className={`px-6 py-3 rounded-xl font-bold transition-all ${isDarkMode ? 'bg-slate-700 hover:bg-slate-600' : 'bg-gray-200 hover:bg-gray-300'}`}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading || uploading}
            className="px-8 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all flex items-center gap-2 disabled:opacity-50"
          >
            <FiSave /> {isLoading ? 'Saving...' : 'Save Product'}
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default ProductForm;