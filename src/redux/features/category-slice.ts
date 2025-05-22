// src/redux/features/category-slice.ts

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CategoryState {
  selectedCategoryName: string;
}

const initialState: CategoryState = {
  selectedCategoryName: "",
};

const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {
    setSelectedCategoryName: (state, action: PayloadAction<string>) => {
      state.selectedCategoryName = action.payload;
    },
  },
});

export const { setSelectedCategoryName } = categorySlice.actions;
export default categorySlice.reducer;
