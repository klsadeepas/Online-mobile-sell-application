import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/orders/';

const initialState = {
  orders: [],
  order: null,
  orderStats: null,
  isLoading: false,
  isError: false,
  message: '',
};

// Create order
export const createOrder = createAsyncThunk('orders/createOrder', async (orderData, thunkAPI) => {
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    const response = await axios.post(API_URL, orderData, {
      headers: { Authorization: `Bearer ${user.token}` }
    });
    return response.data;
  } catch (error) {
    const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

// Get user orders
export const getUserOrders = createAsyncThunk('orders/getUserOrders', async (userId, thunkAPI) => {
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    const response = await axios.get(API_URL + `user/${userId}`, {
      headers: { Authorization: `Bearer ${user.token}` }
    });
    return response.data;
  } catch (error) {
    const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

// Get all orders (admin)
export const getOrders = createAsyncThunk('orders/getOrders', async (params = {}, thunkAPI) => {
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    const queryString = new URLSearchParams(params).toString();
    const response = await axios.get(API_URL + (queryString ? `?${queryString}` : ''), {
      headers: { Authorization: `Bearer ${user.token}` }
    });
    return response.data;
  } catch (error) {
    const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

// Get order by ID
export const getOrderById = createAsyncThunk('orders/getOrderById', async (id, thunkAPI) => {
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    const response = await axios.get(API_URL + id, {
      headers: { Authorization: `Bearer ${user.token}` }
    });
    return response.data;
  } catch (error) {
    const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

// Update order status (admin)
export const updateOrderStatus = createAsyncThunk('orders/updateOrderStatus', async ({ id, orderStatus }, thunkAPI) => {
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    const response = await axios.put(API_URL + `${id}/status`, { orderStatus }, {
      headers: { Authorization: `Bearer ${user.token}` }
    });
    return response.data;
  } catch (error) {
    const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

// Cancel order
export const cancelOrder = createAsyncThunk('orders/cancelOrder', async (id, thunkAPI) => {
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    const response = await axios.put(API_URL + `${id}/cancel`, {}, {
      headers: { Authorization: `Bearer ${user.token}` }
    });
    return response.data;
  } catch (error) {
    const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

// Get order stats (admin)
export const getOrderStats = createAsyncThunk('orders/getOrderStats', async (_, thunkAPI) => {
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    const response = await axios.get(API_URL + 'stats', {
      headers: { Authorization: `Bearer ${user.token}` }
    });
    return response.data;
  } catch (error) {
    const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

export const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.message = '';
      state.order = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create order
      .addCase(createOrder.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.order = action.payload;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Get user orders
      .addCase(getUserOrders.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUserOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload;
      })
      .addCase(getUserOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Get all orders
      .addCase(getOrders.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload.orders;
      })
      .addCase(getOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Get order by ID
      .addCase(getOrderById.fulfilled, (state, action) => {
        state.order = action.payload;
      })
      // Update order status
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        const index = state.orders.findIndex(o => o._id === action.payload._id);
        if (index !== -1) {
          state.orders[index] = action.payload;
        }
      })
      // Cancel order
      .addCase(cancelOrder.fulfilled, (state, action) => {
        const index = state.orders.findIndex(o => o._id === action.payload._id);
        if (index !== -1) {
          state.orders[index] = action.payload;
        }
      })
      // Get order stats
      .addCase(getOrderStats.fulfilled, (state, action) => {
        state.orderStats = action.payload;
      });
  },
});

export const { reset } = orderSlice.actions;
export default orderSlice.reducer;