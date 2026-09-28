import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name:'cart',
  initialState:{
    items:[]
  },
  reducers:{
    addToCart(state,action){
      const product = action.payload;
      state.items.push({...product,quantity:1});
    },
    removeFromCart(state,action){
      const productId = action.payload;
      state.items = state.items.filter((item) => item.id !== productId);
    },
    incrementQuantity(state,action){
      const productId = action.payload;
      const index = state.items.findIndex((item)=>item.id===productId)
      state.items[index].quantity += 1;
    },
    decrementQuantity(state,action){
      const productId = action.payload;
      const index = state.items.findIndex((item)=>item.id===productId)
      if(state.items[index].quantity >= 2)
        state.items[index].quantity -= 1;
    },
    clearCart(state){
      state.items = [];
    }
  }
})

export const {
  // all these are action creators created by redux toolkit
  addToCart,
  removeFromCart,
  incrementQuantity,
  decrementQuantity,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;