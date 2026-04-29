import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FiPhone, FiMail, FiMapPin, FiFacebook, FiTwitter, FiInstagram, FiLinkedin } from 'react-icons/fi';

const Footer = () => {
  const { isDarkMode } = useSelector((state) => state.theme);

  return (
    <footer className={`${isDarkMode ? 'bg-slate-800' : 'bg-gray-900'} text-white`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-xl">M</span>
              </div>
              <span className="text-xl font-bold">MobileHub</span>
            </div>
            <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-400'} mb-4`}>
              Your one-stop destination for the latest mobile phones at the best prices.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-blue-500 transition">
                <FiFacebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition">
                <FiTwitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-pink-500 transition">
                <FiInstagram size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-600 transition">
                <FiLinkedin size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-white transition">Home</Link>
              </li>
              <li>
                <Link to="/products" className="text-gray-400 hover:text-white transition">Products</Link>
              </li>
              <li>
                <Link to="/cart" className="text-gray-400 hover:text-white transition">Cart</Link>
              </li>
              <li>
                <Link to="/orders" className="text-gray-400 hover:text-white transition">Orders</Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Customer Service</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition">About Us</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition">Contact Us</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition">Privacy Policy</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition">Terms & Conditions</a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-center space-x-3 text-gray-400">
                <FiPhone className="flex-shrink-0" />
                <span>+1 234 567 890</span>
              </li>
              <li className="flex items-center space-x-3 text-gray-400">
                <FiMail className="flex-shrink-0" />
                <span>support@mobilehub.com</span>
              </li>
              <li className="flex items-center space-x-3 text-gray-400">
                <FiMapPin className="flex-shrink-0" />
                <span>123 Tech Street, New York, NY 10001</span>
              </li>
            </ul>
          </div>
        </div>

        <div className={`mt-8 pt-8 border-t ${isDarkMode ? 'border-slate-700' : 'border-gray-800'}`}>
          <p className="text-center text-gray-400">
            © {new Date().getFullYear()} MobileHub. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;