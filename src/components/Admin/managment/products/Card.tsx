"use client";
import React, { useState, useEffect } from "react";
import { useDisclosure } from "@mantine/hooks";
import {
  Drawer,
  Center,
  Loader,
  Button,
} from "@mantine/core";
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
import Pagination from "@/components/Common/pagination";
import ProductFilter from "./ProductFilters";

function ProductsCard() {
  const [opened, { open, close }] = useDisclosure(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [Subcategories, setSubcategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    name: "",
    category: "",
    subcategory: "",
    brand: "",
  });

  const itemsPerPage = 16;

  useEffect(() => {
    async function loadProducts() {
      setLoading(true);
      try {
        const data = await fetchProducts();
        setProducts(data);
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
      } catch (error) {
        console.error(error);
      }
    }

    async function loadBrands() {
      try {
        const brandsData = await fetchBrands();
        setBrands(brandsData);
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

  const handleEditClick = (product) => {
    setEditingProduct(product);
    open();
  };

  const handleFormSubmit = async (formData) => {
    try {
      if (editingProduct) {
        await updateProduct(editingProduct.product_id, formData);
      } else {
        await addProduct(formData);
      }
      const newList = await fetchProducts();
      setProducts(newList);
      close();
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
  };

  async function handleDeleteProduct(id) {
    const toastId = toast.loading("Deleting Product...");
    try {
      await deleteProduct(id);
      const updatedList = await fetchProducts();
      setProducts(updatedList);
      toast.success("Product deleted successfully", { id: toastId });
    } catch (error) {
      if (error.message?.includes("existing products")) {
        toast.error("Cannot delete brand because there are products linked to it.", {
          id: toastId,
        });
      } else {
        toast.error(error.message || "Failed to delete Product", { id: toastId });
      }
    }
  }

  // Extract unique values for filters
  const categories = Array.from(new Set(products.map(p => p.category_name))).filter(Boolean);
  const filteredSubcategories = Array.from(
    new Set(
      products
        .filter(p => !filters.category || p.category_name === filters.category)
        .map(p => p.subcategory_name)
    )
  ).filter(Boolean);
  const brandsList = Array.from(new Set(products.map(p => p.brand_name))).filter(Boolean);

  // Filtering logic
  const filteredProducts = products.filter(p => {
    return (
      (p.product_name?.toLowerCase() || "").includes(filters.name.toLowerCase()) &&
      (!filters.category || p.category_name === filters.category) &&
      (!filters.subcategory || p.subcategory_name === filters.subcategory) &&
      (!filters.brand || p.brand_name === filters.brand)
    );
  });

  const indexOfLastProduct = currentPage * itemsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  // Reset filters handler
  const resetFilters = () => {
    setFilters({ name: "", category: "", subcategory: "", brand: "" });
    setCurrentPage(1);
  };

  // Whenever filters change, reset to page 1
  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  return (
    <div className="p-8">
      <Toaster position="top-center" />

      <div className="flex justify-between items-center flex-wrap gap-4 mb-4">
        <p className="text-2xl font-bold text-gray-800">All Products</p>
        <Button
          variant="outline"
          color="green"
          onClick={handleAddClick}
          size="sm"
          radius="xl"
        >
          Add Product
        </Button>
      </div>

      {/* Use the new ProductFilter component */}
      <ProductFilter
        filters={filters}
        setFilters={setFilters}
        categories={categories}
        filteredSubcategories={filteredSubcategories}
        brandsList={brandsList}
        onReset={resetFilters}
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
              product={currentProducts}
              onEdit={handleEditClick}
              onDelete={handleDeleteProduct}
            />
          </div>
        </Center>
      )}

      <Pagination
        currentPage={currentPage}
        totalPages={Math.ceil(filteredProducts.length / itemsPerPage)}
        onPageChange={(page) => setCurrentPage(page)}
      />

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
