import { configureStore } from "@reduxjs/toolkit";
import cartReducer from './cartSlice'
import productReducer from './productsSlice'

function loadFromLocalStorage(){
  const saved = localStorage.getItem('cart');
  return saved? JSON.parse(saved): undefined;
}

const store = configureStore({
  reducer:{
    cart:cartReducer,
    products:productReducer
  },
  preloadedState:{
    cart : loadFromLocalStorage() || {items:[]}
  }
})

store.subscribe(()=>{
  const cartState = store.getState().cart;
  localStorage.setItem('cart',JSON.stringify(cartState));
})

export default store;