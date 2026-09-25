import { createSlice } from "@reduxjs/toolkit";

const counterSlice = createSlice({
  name:"counter",
  initialState:{value:0},
  reducers:{
    increment(state){
      state.value += 1;// immer js will take care of it.
    },
    decrement(state){
      state.value -= 1;
    }
  }
})