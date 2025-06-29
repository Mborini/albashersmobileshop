import { createSlice } from "@reduxjs/toolkit";
import { Product } from "@/types/product";

type InitialState = {
  value: Product;
};

const initialState: InitialState = {
  value: {
    id: 0,
    title: "",
    description: "",
    price: 0,
    discountedPrice: 0,
    brand_id: 0,
    subcategory_id: 0,
    category_name: "",
    subcategory_name: "",
    brand_name: "",
    images: [],
    product_images: [],
    attributes: [],
    is_new_arrival: "",
    is_best_offer: "",
    name: "",
    value: "",  
    colors: [],
    product_id: 0,
  },
};

export const productDetails = createSlice({
  name: "productDetails",
  initialState,
  reducers: {
    updateproductDetails: (_, action) => {
      return {
        value: {
          ...action.payload,
        },
      };
    },
  },
});

export const { updateproductDetails } = productDetails.actions;
export default productDetails.reducer;
