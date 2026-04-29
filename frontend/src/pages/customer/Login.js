import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { login, reset } from '../../store/slices/authSlice';
import { toast } from 'react-toastify';
import { FiMail, FiLock, FiArrowRight } from 'react-icons/fi';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const { email, password } = formData;

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const { user, isLoading, isError, isSuccess, message } = useSelector((state) => state.auth);
  const { isDarkMode } = useSelector((state) => state.theme);

  useEffect(() => {
    if (isError) toast.error(message);
    if (isSuccess || user) {
      const from = location.state?.from?.pathname || (user?.role === 'admin' ? '/admin' : '/');
      navigate(from, { replace: true });
    }
    dispatch(reset());
  }, [user, isError, isSuccess, message, navigate, dispatch, location]);

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = (e) => {
    e.preventDefault();
    dispatch(login({ email, password }));
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-12 bg-gradient-to-br from-blue-600/10 via-transparent to-purple-600/10">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`max-w-md w-full p-8 rounded-3xl shadow-2xl backdrop-blur-lg border ${
          isDarkMode ? 'bg-slate-800/80 border-slate-700' : 'bg-white/80 border-white'
        }`}
      >
        <div className="text-center mb-8">
          <h2 className={`text-3xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Welcome Back</h2>
          <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Login to your MobileHub account</p>
        </div>

        <form onSubmit={onSubmit} className="space-y-6">
          <div className="relative">
            <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="email"
              name="email"
              value={email}
              onChange={onChange}
              placeholder="Email Address"
              required
              className={`w-full pl-10 pr-4 py-3 rounded-xl border focus:ring-2 focus:ring-blue-500 transition-all outline-none ${
                isDarkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'
              }`}
            />
          </div>

          <div className="relative">
            <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="password"
              name="password"
              value={password}
              onChange={onChange}
              placeholder="Password"
              required
              className={`w-full pl-10 pr-4 py-3 rounded-xl border focus:ring-2 focus:ring-blue-500 transition-all outline-none ${
                isDarkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'
              }`}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-bold hover:shadow-lg hover:scale-[1.02] transition-all flex items-center justify-center space-x-2 disabled:opacity-70"
          >
            {isLoading ? (
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <span>Login</span>
                <FiArrowRight />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
            Don't have an account?{' '}
            <Link to="/register" className="text-blue-500 font-semibold hover:underline">
              Register here
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;