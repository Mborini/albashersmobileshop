export type Attribute = {
  attribute_id: number;
  name?: string;
  value: string;
};
export type Colors = {
  id: number;
  name: string;
  hex_code: string;
};


  export type ProductImage = {
    id: number;
    image_url: string;
    alt_text?: string;  // اختيارية لو حبيت تضيف وصف للصورة
  };
  


export type Product = {
  product_images: ProductImage[];
  id?: number;
  title: string;
  description?: string;
  price: number;
  discountedPrice?: number;
  brand_id?: number;
  subcategory_id?: number;
  category_name?: string;
  subcategory_name?: string;
  brand_name?: string;
  images?: string[];
  attributes?: Attribute[];
  is_new_arrival?: string;
  is_best_offer?: string;
  name?: string;
  value: string;
  colors:Colors[];
  product_id?: number;
  
};
