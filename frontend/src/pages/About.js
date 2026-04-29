import React from 'react';
import { motion } from 'framer-motion';
import { FiTarget, FiUsers, FiAward, FiShield, FiTruck, FiSmile } from 'react-icons/fi';
import { useSelector } from 'react-redux';

const About = () => {
    const { isDarkMode } = useSelector((state) => state.theme);

    const features = [
        { icon: <FiTarget />, title: 'Our Mission', desc: 'To provide the most advanced mobile technology to everyone at competitive prices.' },
        { icon: <FiUsers />, title: 'Expert Team', desc: 'Our team consists of tech enthusiasts who live and breathe mobile innovation.' },
        { icon: <FiAward />, title: 'Quality First', desc: 'We only partner with official brands to ensure 100% genuine products.' },
        { icon: <FiShield />, title: 'Secure Shopping', desc: 'Your data and transactions are protected by industry-standard encryption.' },
        { icon: <FiTruck />, title: 'Fast Delivery', desc: 'Experience lightning-fast shipping with real-time tracking for every order.' },
        { icon: <FiSmile />, title: 'Happy Customers', desc: 'Our 24/7 support ensures every query is resolved with a smile.' },
    ];

    return (
        <div className={`min-h-screen pt-24 pb-16 ${isDarkMode ? 'bg-slate-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Hero Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-20"
                >
                    <h1 className="text-5xl lg:text-7xl font-extrabold mb-8 leading-tight">
                        About <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">MobileHub</span>
                    </h1>
                    <p className={`text-xl max-w-3xl mx-auto leading-relaxed ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Welcome to MobileHub, your number one source for all things mobile. We're dedicated to giving you the very best of smartphones, with a focus on reliability, customer service, and uniqueness.
                    </p>
                </motion.div>

                {/* Image/Content Section */}
                <div className="grid lg:grid-cols-2 gap-12 items-center mb-24">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h2 className="text-3xl font-bold mb-6">Our Journey</h2>
                        <p className={`text-lg mb-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            Founded in 2024, MobileHub has come a long way from its beginnings. When we first started out, our passion for "Tech for All" drove us to do tons of research so that MobileHub can offer you the world's most advanced devices.
                        </p>
                        <p className={`text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            We now serve customers all over the world and are thrilled that we're able to turn our passion into our own website. We hope you enjoy our products as much as we enjoy offering them to you.
                        </p>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="relative rounded-[2rem] overflow-hidden shadow-2xl aspect-video"
                    >
                        <img
                            src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=800"
                            alt="Our Office"
                            className="w-full h-full object-cover"
                        />
                    </motion.div>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ y: -5 }}
                            className={`p-8 rounded-3xl transition-all duration-300 border ${isDarkMode ? 'bg-slate-800 border-slate-700 hover:bg-slate-700/50' : 'bg-white border-gray-100 hover:shadow-2xl'
                                }`}
                        >
                            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center text-blue-600 mb-6 text-2xl">
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                            <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>{feature.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default About;