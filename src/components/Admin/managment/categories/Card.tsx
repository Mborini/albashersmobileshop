"use client";
import React, { useState, useEffect } from "react";
import { useDisclosure } from "@mantine/hooks";
import { Drawer, Divider, Center, Loader, Button } from "@mantine/core";
import { Toaster, toast } from "react-hot-toast";
import CategoryForm from "./Form";
import {
  fetchCategories,
  addCategory,
  updateCategory,
} from "./services/categoryService";
import List from "./List";

function CategoriesCard() {
  const [opened, { open, close }] = useDisclosure(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadCategories() {
      setLoading(true);
      try {
        const data = await fetchCategories();
        setCategories(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    loadCategories();
  }, []);

  const handleAddClick = () => {
    setEditingCategory(null);
    open();
  };

  const handleEditClick = (category) => {
    setEditingCategory(category);
    open();
  };

  const handleFormSubmit = async (formData) => {
    try {
      if (editingCategory) {
        const updated = await updateCategory(editingCategory.id, formData);
        setCategories((prev) =>
          prev.map((cat) => (cat.id === updated.id ? updated : cat))
        );
      } else {
        const added = await addCategory(formData);
        setCategories((prev) => [...prev, added]);
      }
      close();
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  async function handleDeleteCategory(id: number) {
    const toastId = toast.loading("Deleting Category ...");
  
    try {
      const response = await fetch(`/api/Admin/categories/${id}`, {
        method: "DELETE",
      });
  
      const data = await response.json().catch(() => ({}));
  
      if (!response.ok) {
        throw new Error(data?.error || "Failed to delete category");
      }
  
      setCategories((prev) => prev.filter((cat) => cat.id !== id));
  
      toast.success(" Category deleted successfully", { id: toastId });
    
    } catch (error) {
      console.error("Delete category error:", error);
      toast.error(error.message || "Failed to delete category", { id: toastId });

  }
  }
  

  return (
    <div className="p-8">
      <Toaster position="top-center" />
      <div className="flex justify-center items-center">
        <p className="text-2xl font-bold text-gray-800">All Categories</p>
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
            Add Category
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
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "1.5rem",
              maxWidth: 1200,
              width: "100%",
              marginTop: "1rem",
            }}
          >
            <List
              categories={categories}
              onEdit={handleEditClick}
              onDelete={handleDeleteCategory}
            />
          </div>
        </Center>
      )}

      <Drawer
        opened={opened}
        onClose={close}
        title={editingCategory ? "Edit Category" : "Add Category"}
        position="right"
        size="sm"
      >
        <CategoryForm
          category={editingCategory}
          onSubmit={handleFormSubmit}
          onCancel={close}
        />
      </Drawer>
    </div>
  );
}

export default CategoriesCard;
