export type Attribute = {
  attribute_id: number;
  name?: string;
  value: string;
};

export type Product = {
  id?: number;
  product_name: string;
  description?: string;
  price: number;
  discountedPrice?: number;
  brand_id?: number;
  subcategory_id?: number;
  category_name?: string;
  subcategory_name?: string;
  brand_name?: string;
  image?: string;
  attributes?: Attribute[];
};
