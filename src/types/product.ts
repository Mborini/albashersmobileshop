export type Attribute = {
  attribute_id: number;
  name?: string;
  value: string;
};

export type Product = {
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
};
