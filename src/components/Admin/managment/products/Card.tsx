"use client";
import React, { useState, useEffect } from "react";
import { useDisclosure } from "@mantine/hooks";
import { Drawer, Divider, Center, Loader, Button } from "@mantine/core";
import { Toaster, toast } from "react-hot-toast";
import ProductForm from "./Form";
import List from "./List";
import {
  fetchProducts,
  addProduct,
  updateProduct,
  deleteProduct,
} from "./services/Products";
import { fetchSubCategories } from "../subCategories/services/SubCategoryService";
import { fetchBrands } from "../brands/services/BrandsService";
function ProductsCard() {
  const [opened, { open, close }] = useDisclosure(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [Subcategories, setSubcategories] = useState([]);
  const [brands, setBrands] = useState([]);
  useEffect(() => {
    async function loadProducts() {
      setLoading(true);
      try {
        const data = await fetchProducts();
        setProducts(data);

        console.log("Fetched products:", data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    async function loadSubCategories() {
      try {
        const subcategoriesData = await fetchSubCategories();
        setSubcategories(subcategoriesData);
        console.log("Fetched subcategories:", subcategoriesData);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    async function loadBrands() {
      try {
        const brandsData = await fetchBrands();
        setBrands(brandsData);
        console.log("Fetched brands:", brandsData);
      } catch (error) {
        console.error(error);
      }
    }
    loadBrands();
    loadProducts();
    loadSubCategories();
  }, []);

  const handleAddClick = () => {
    setEditingProduct(null);
    open();
  };

  const handleEditClick = (brand) => {
    setEditingProduct(brand);
    open();
  };
  const handleFormSubmit = async (formData) => {
    try {
      if (editingProduct) {
        const updated = await updateProduct(editingProduct.id, formData);
        setProducts((prev) =>
          prev.map((p) => (p.id === updated.id ? updated : p))
        );
      } else {
        await addProduct(formData);
        const newList = await fetchProducts(); 
        setProducts(newList);
      }
      close();
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
  };

  async function handleDeleteProduct(id: number) {
    const toastId = toast.loading("Deleting Brand...");

    try {
      await deleteProduct(id);

      setProducts((prev) => prev.filter((brand) => brand.id !== id));
      toast.success("Brand deleted successfully", { id: toastId });
    } catch (error: any) {
      console.error("Delete Brand error:", error);

      if (error.message && error.message.includes("existing products")) {
        toast.error(
          "Cannot delete brand because there are products linked to it.",
          {
            id: toastId,
          }
        );
      } else {
        toast.error(error.message || "Failed to delete Brand", {
          id: toastId,
        });
      }
    }
  }

  return (
    <div className="p-8">
      <Toaster position="top-center" />
      <div className="flex justify-center items-center">
        <p className="text-2xl font-bold text-gray-800">All Products</p>
      </div>

      <Divider
        my="xs"
        label={
          <Button
            variant="outline"
            color="green"
            onClick={handleAddClick}
            size="sm"
            radius="xl"
          >
            Add Product
          </Button>
        }
        labelPosition="right"
      />

      {loading ? (
        <Center mt="xl">
          <Loader size="lg" />
        </Center>
      ) : (
        <Center>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: "1.5rem",
              maxWidth: 1200,
              width: "100%",
              marginTop: "1rem",
            }}
          >
            <List
              product={products}
              onEdit={handleEditClick}
              onDelete={handleDeleteProduct}
            />
          </div>
        </Center>
      )}

      <Drawer
        opened={opened}
        onClose={close}
        title={editingProduct ? "Edit Product" : "Add Product"}
        position="right"
        size="sm"
      >
        <ProductForm
          brands={brands}
          subcategories={Subcategories}
          product={editingProduct}
          onSubmit={handleFormSubmit}
          onCancel={close}
        />
      </Drawer>
    </div>
  );
}

export default ProductsCard;
