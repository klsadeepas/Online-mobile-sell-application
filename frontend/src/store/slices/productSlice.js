import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/products/';

const initialState = {
  products: [],
  featuredProducts: [],
  flashSaleProducts: [],
  product: null,
  relatedProducts: [],
  brands: [],
  total: 0,
  pages: 1,
  page: 1,
  isLoading: false,
  isError: false,
  message: '',
};

// Get products
export const getProducts = createAsyncThunk('products/getProducts', async (params = {}, thunkAPI) => {
  try {
    const queryString = new URLSearchParams(params).toString();
    const response = await axios.get(API_URL + (queryString ? `?${queryString}` : ''));
    return response.data;
  } catch (error) {
    const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

// Get featured products
export const getFeaturedProducts = createAsyncThunk('products/getFeaturedProducts', async (_, thunkAPI) => {
  try {
    const response = await axios.get(API_URL + 'featured');
    return response.data;
  } catch (error) {
    const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

// Get flash sale products
export const getFlashSaleProducts = createAsyncThunk('products/getFlashSaleProducts', async (_, thunkAPI) => {
  try {
    const response = await axios.get(API_URL + 'flash-sales');
    return response.data;
  } catch (error) {
    const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

// Get product by ID
export const getProductById = createAsyncThunk('products/getProductById', async (id, thunkAPI) => {
  try {
    const response = await axios.get(API_URL + id);
    return response.data;
  } catch (error) {
    const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

// Get related products
export const getRelatedProducts = createAsyncThunk('products/getRelatedProducts', async (id, thunkAPI) => {
  try {
    const response = await axios.get(API_URL + `${id}/related`);
    return response.data;
  } catch (error) {
    const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

// Get brands
export const getBrands = createAsyncThunk('products/getBrands', async (_, thunkAPI) => {
  try {
    const response = await axios.get(API_URL + 'brands');
    return response.data;
  } catch (error) {
    const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

// Admin: Create product
export const createProduct = createAsyncThunk('products/createProduct', async (productData, thunkAPI) => {
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    const response = await axios.post(API_URL, productData, {
      headers: { Authorization: `Bearer ${user.token}` }
    });
    return response.data;
  } catch (error) {
    const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

// Admin: Update product
export const updateProduct = createAsyncThunk('products/updateProduct', async ({ id, productData }, thunkAPI) => {
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    const response = await axios.put(API_URL + id, productData, {
      headers: { Authorization: `Bearer ${user.token}` }
    });
    return response.data;
  } catch (error) {
    const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

// Admin: Delete product
export const deleteProduct = createAsyncThunk('products/deleteProduct', async (id, thunkAPI) => {
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    await axios.delete(API_URL + id, {
      headers: { Authorization: `Bearer ${user.token}` }
    });
    return id;
  } catch (error) {
    const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

export const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.message = '';
      state.product = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get products
      .addCase(getProducts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.products = action.payload.products;
        state.total = action.payload.total;
        state.pages = action.payload.pages;
        state.page = action.payload.page;
      })
      .addCase(getProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Get featured products
      .addCase(getFeaturedProducts.fulfilled, (state, action) => {
        state.featuredProducts = action.payload;
      })
      // Get flash sale products
      .addCase(getFlashSaleProducts.fulfilled, (state, action) => {
        state.flashSaleProducts = action.payload;
      })
      // Get product by ID
      .addCase(getProductById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getProductById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.product = action.payload;
      })
      .addCase(getProductById.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Get related products
      .addCase(getRelatedProducts.fulfilled, (state, action) => {
        state.relatedProducts = action.payload;
      })
      // Get brands
      .addCase(getBrands.fulfilled, (state, action) => {
        state.brands = action.payload;
      })
      // Create product
      .addCase(createProduct.fulfilled, (state, action) => {
        state.products.unshift(action.payload);
      })
      // Update product
      .addCase(updateProduct.fulfilled, (state, action) => {
        const index = state.products.findIndex(p => p._id === action.payload._id);
        if (index !== -1) {
          state.products[index] = action.payload;
        }
      })
      // Delete product
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.products = state.products.filter(p => p._id !== action.payload);
      });
  },
});

export const { reset } = productSlice.actions;
export default productSlice.reducer;