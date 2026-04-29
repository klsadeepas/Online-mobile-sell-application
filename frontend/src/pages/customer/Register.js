import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { register, reset } from '../../store/slices/authSlice';
import { toast } from 'react-toastify';
import { FiUser, FiMail, FiLock, FiPhone, FiMapPin, FiArrowRight } from 'react-icons/fi';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: ''
  });

  const { name, email, password, confirmPassword, phone, address } = formData;

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, isLoading, isError, isSuccess, message } = useSelector((state) => state.auth);
  const { isDarkMode } = useSelector((state) => state.theme);

  useEffect(() => {
    if (isError) toast.error(message);
    if (isSuccess || user) navigate('/');
    dispatch(reset());
  }, [user, isError, isSuccess, message, navigate, dispatch]);

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
    } else {
      dispatch(register({ name, email, password, phone, address }));
    }
  };

  const inputStyle = `w-full pl-10 pr-4 py-3 rounded-xl border focus:ring-2 focus:ring-blue-500 transition-all outline-none ${
    isDarkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'
  }`;

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-12 bg-gradient-to-br from-blue-600/10 via-transparent to-purple-600/10">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`max-w-2xl w-full p-8 rounded-3xl shadow-2xl backdrop-blur-lg border ${
          isDarkMode ? 'bg-slate-800/80 border-slate-700' : 'bg-white/80 border-white'
        }`}
      >
        <div className="text-center mb-8">
          <h2 className={`text-3xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Create Account</h2>
          <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Join MobileHub and start shopping</p>
        </div>

        <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="relative">
            <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" name="name" value={name} onChange={onChange} placeholder="Full Name" required className={inputStyle} />
          </div>

          <div className="relative">
            <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="email" name="email" value={email} onChange={onChange} placeholder="Email Address" required className={inputStyle} />
          </div>

          <div className="relative">
            <FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" name="phone" value={phone} onChange={onChange} placeholder="Phone Number" required className={inputStyle} />
          </div>

          <div className="relative">
            <FiMapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" name="address" value={address} onChange={onChange} placeholder="Shipping Address" required className={inputStyle} />
          </div>

          <div className="relative">
            <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="password" name="password" value={password} onChange={onChange} placeholder="Password" required className={inputStyle} />
          </div>

          <div className="relative">
            <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="password" name="confirmPassword" value={confirmPassword} onChange={onChange} placeholder="Confirm Password" required className={inputStyle} />
          </div>

          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-bold hover:shadow-lg hover:scale-[1.01] transition-all flex items-center justify-center space-x-2 disabled:opacity-70"
            >
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>Register Now</span>
                  <FiArrowRight />
                </>
              )}
            </button>
          </div>
        </form>

        <div className="mt-8 text-center border-t pt-6 border-gray-200 dark:border-slate-700">
          <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
            Already have an account?{' '}
            <Link to="/login" className="text-blue-500 font-semibold hover:underline">
              Login here
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;