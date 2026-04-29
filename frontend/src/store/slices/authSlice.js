import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth/';

// Get user from localStorage
const user = JSON.parse(localStorage.getItem('user'));

const initialState = {
  user: user ? user : null,
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: '',
};

// Register user
export const register = createAsyncThunk('auth/register', async (userData, thunkAPI) => {
  try {
    const response = await axios.post(API_URL + 'register', userData);
    if (response.data) {
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
  } catch (error) {
    const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

// Login user
export const login = createAsyncThunk('auth/login', async (userData, thunkAPI) => {
  try {
    const response = await axios.post(API_URL + 'login', userData);
    if (response.data) {
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
  } catch (error) {
    const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

// Logout
export const logout = createAsyncThunk('auth/logout', async () => {
  localStorage.removeItem('user');
});

// Get profile
export const getProfile = createAsyncThunk('auth/getProfile', async (_, thunkAPI) => {
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    const response = await axios.get(API_URL + 'profile', {
      headers: { Authorization: `Bearer ${user.token}` }
    });
    return response.data;
  } catch (error) {
    const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

// Update profile
export const updateProfile = createAsyncThunk('auth/updateProfile', async (userData, thunkAPI) => {
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    const response = await axios.put(API_URL + 'profile', userData, {
      headers: { Authorization: `Bearer ${user.token}` }
    });
    if (response.data) {
      localStorage.setItem('user', JSON.stringify({ ...user, ...response.data }));
    }
    return response.data;
  } catch (error) {
    const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

// Add to wishlist
export const addToWishlist = createAsyncThunk('auth/addToWishlist', async (productId, thunkAPI) => {
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    const response = await axios.post(API_URL + `wishlist/${productId}`, {}, {
      headers: { Authorization: `Bearer ${user.token}` }
    });
    return response.data;
  } catch (error) {
    const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

// Remove from wishlist
export const removeFromWishlist = createAsyncThunk('auth/removeFromWishlist', async (productId, thunkAPI) => {
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    const response = await axios.delete(API_URL + `wishlist/${productId}`, {
      headers: { Authorization: `Bearer ${user.token}` }
    });
    return response.data;
  } catch (error) {
    const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.isSuccess = false;
      state.message = '';
    },
    loginSuccess: (state, action) => {
      state.user = action.payload;
      localStorage.setItem('user', JSON.stringify(action.payload));
    },
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(register.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload;
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.user = null;
      })
      // Login
      .addCase(login.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.user = null;
      })
      // Logout
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
      })
      // Get profile
      .addCase(getProfile.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = { ...state.user, ...action.payload };
      })
      .addCase(getProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Update profile
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.user = { ...state.user, ...action.payload };
      })
      // Wishlist
      .addCase(addToWishlist.fulfilled, (state, action) => {
        state.user.wishlist = action.payload;
      })
      .addCase(removeFromWishlist.fulfilled, (state, action) => {
        state.user.wishlist = action.payload;
      });
  },
});

export const { reset, loginSuccess } = authSlice.actions;
export default authSlice.reducer;