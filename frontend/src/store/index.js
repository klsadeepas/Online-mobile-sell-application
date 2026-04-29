import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import cartReducer from './slices/cartSlice';
import productReducer from './slices/productSlice';
import orderReducer from './slices/orderSlice';
import userReducer from './slices/userSlice'; // Import userReducer
import themeReducer from './slices/themeSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    users: userReducer, // Add userReducer
    products: productReducer,
    orders: orderReducer,
    theme: themeReducer,
  },
});