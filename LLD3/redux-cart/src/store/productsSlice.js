import { createSlice, createAsyncThunk} from "@reduxjs/toolkit";

export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async () => {
    const response = await fetch("https://fakestoreapi.com/products");
    if (!response.ok) {
      throw new Error("Failed to fetch products");
    }
    const data = await response.json();
    return data;
  }
); 

const productSlice = createSlice({
  name:'product',
  initialState:{
    items:[],
    loading:false,
    error:null
  },
  extraReducers:(builder)=>{
   builder.addCase(fetchProducts.pending,(state)=>{
      state.loading = true;
      state.error = null;
   })
   .addCase(fetchProducts.fulfilled,(state,action)=>{
      state.items = action.payload;
      state.loading = false;
   })
   .addCase(fetchProducts.rejected,(state,action)=>{
      state.loading = false;
      state.error = action.error.message;
   })
  }
})

export default productSlice.reducer;