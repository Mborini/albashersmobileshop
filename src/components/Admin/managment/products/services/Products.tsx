import { Product } from "@/types/product";

const API_URL = "/api/Admin/products";

export async function fetchProducts() {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error("Failed to fetch products");
  return await res.json();
  
}

export async function addProduct(product: Product) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(product),
  });

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error || "Failed to add product");
  }

  return await res.json();
}

export async function updateProduct(id: number, product: Product) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(product),
  });

  if (!res.ok) {
    let message = "Failed to update product";
    try {
      const data = await res.json();
      message = data.error || message;
    } catch (err) {
      console.error("Error parsing error response", err);
    }
    throw new Error(message);
  }

  return await res.json();
}

export async function deleteProduct(id: number) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    const errorData = await response.json();
    const error = new Error(errorData.error || "Failed to delete product");
    throw error;
  }
  return true;
}
//fetchAttributes send id in body
export async function fetchAttributes(id) {
  const res = await fetch(`/api/Admin/attributes/${id}`);
  if (!res.ok) throw new Error("Failed to fetch attributes");
  return await res.json();
}

// services/Products.js (or wherever you keep it)


export async function updateAttributes(id, data) {
  const res = await fetch(`${API_URL}/subCatProductAttr/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to update product: ${errorText}`);
  }

  return await res.json();
}
export async function AddProductImage(id: number, image: string): Promise<Product> {
  const res = await fetch(`${API_URL}/${id}/updateImage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ image }),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || "Failed to add product image");
  }

  const data = await res.json();
  return {
    product_id: id,
    product_images: data.images
  } as Product;
}
export async function uploadImage(file: File, oldImageUrl?: string): Promise<string> {
  const formData = new FormData();
  formData.append("folder", "products"); // اسم الفولدر داخل S3
  formData.append("file", file);

  if (oldImageUrl) {
    formData.append("oldImageUrl", oldImageUrl);
  }

  const res = await fetch("/api/Admin/uploadImage", {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error("S3 Upload Failed: " + error);
  }

  const result = await res.json();

  if (!result.s3Url) {
    throw new Error("Upload response missing s3Url");
  }

  return result.s3Url;
}

interface Image {
  id: number;
  image_url: string;
}

interface DeleteProductResponse {
  success: boolean;
  images: Image[];
}


export async function DeleteProductImage(
  imageId: number
): Promise<DeleteProductResponse> {
  try {
    const response = await fetch(`${API_URL}/${imageId}/updateImage`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to delete image");
    }

    const updatedProduct = await response.json();
    return updatedProduct;
  } catch (error) {
    throw error;
  }
}
