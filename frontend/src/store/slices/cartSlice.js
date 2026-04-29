import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/cart/';

const initialState = {
  cart: null,
  isLoading: false,
  isError: false,
  message: '',
};

// Get cart
export const getCart = createAsyncThunk('cart/getCart', async (userId, thunkAPI) => {
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    const response = await axios.get(API_URL + userId, {
      headers: { Authorization: `Bearer ${user.token}` }
    });
    return response.data;
  } catch (error) {
    const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

// Add to cart
export const addToCart = createAsyncThunk('cart/addToCart', async ({ userId, productId, quantity }, thunkAPI) => {
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    const response = await axios.post(API_URL, { userId, productId, quantity }, {
      headers: { Authorization: `Bearer ${user.token}` }
    });
    return response.data;
  } catch (error) {
    const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

// Update cart item
export const updateCartItem = createAsyncThunk('cart/updateCartItem', async ({ userId, itemId, quantity }, thunkAPI) => {
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    const response = await axios.put(API_URL + `${userId}/${itemId}`, { quantity }, {
      headers: { Authorization: `Bearer ${user.token}` }
    });
    return response.data;
  } catch (error) {
    const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

// Remove from cart
export const removeFromCart = createAsyncThunk('cart/removeFromCart', async ({ userId, itemId }, thunkAPI) => {
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    const response = await axios.delete(API_URL + `${userId}/${itemId}`, {
      headers: { Authorization: `Bearer ${user.token}` }
    });
    return response.data;
  } catch (error) {
    const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

// Clear cart
export const clearCart = createAsyncThunk('cart/clearCart', async (userId, thunkAPI) => {
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    const response = await axios.delete(API_URL + userId, {
      headers: { Authorization: `Bearer ${user.token}` }
    });
    return response.data;
  } catch (error) {
    const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.message = '';
    },
  },
  extraReducers: (builder) => {
    builder
      // Get cart
      .addCase(getCart.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getCart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cart = action.payload;
      })
      .addCase(getCart.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Add to cart
      .addCase(addToCart.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cart = action.payload;
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Update cart item
      .addCase(updateCartItem.fulfilled, (state, action) => {
        state.cart = action.payload;
      })
      // Remove from cart
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.cart = action.payload;
      })
      // Clear cart
      .addCase(clearCart.fulfilled, (state) => {
        state.cart = null;
      });
  },
});

export const { reset } = cartSlice.actions;
export default cartSlice.reducer;