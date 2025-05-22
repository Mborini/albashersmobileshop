// src/redux/features/subCategory-slice.ts

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SubCategoryState {
  selectedSubCategoryName: string;
}

const initialState: SubCategoryState = {
  selectedSubCategoryName: "",
};

const subCategorySlice = createSlice({
  name: "subCategory",
  initialState,
  reducers: {
    setSelectedSubCategoryName: (state, action: PayloadAction<string>) => {
      state.selectedSubCategoryName = action.payload;
    },
  },
});

export const { setSelectedSubCategoryName } = subCategorySlice.actions;
export default subCategorySlice.reducer;
