"use client";
import React, { useState, useEffect } from "react";
import { useDisclosure } from "@mantine/hooks";
import { Drawer, Divider, Center, Loader, Button } from "@mantine/core";

import { Toaster, toast } from "react-hot-toast";
import SubCategoryForm from "./Form";
import {
  fetchSubCategories,
  addSubCategory,
  updateSubCategory,
  deleteSubCategory,
} from "./services/SubCategoryService";
import List from "./List";
import { fetchCategories } from "../categories/services/categoryService";

function SubCategoriesCard() {
  const [opened, { open, close }] = useDisclosure(false);
  const [editingSubCategory, setEditingSubCategory] = useState(null);
  const [Subcategories, setSubCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    async function loadSubCategories() {
      setLoading(true);
      try {
        const data = await fetchSubCategories();
        setSubCategories(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    loadSubCategories();
  }, []);

 
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
    setEditingSubCategory(null);
    open();
  };

  const handleEditClick = (category) => {
    setEditingSubCategory(category);
    open();
  };

  const handleFormSubmit = async (formData) => {
    try {
      if (editingSubCategory) {
        const updated = await updateSubCategory(editingSubCategory.id, formData);

        // add category name to the updated subcategory
        const category = categories.find(cat => cat.id === updated.category_id);
        const updatedWithCategoryName = {
          ...updated,
          categories_name: category ? category.name : ""
        };
  
        setSubCategories((prev) =>
          prev.map((cat) => (cat.id === updated.id ? updatedWithCategoryName : cat))
        );
      } else {
        const added = await addSubCategory(formData);
  
        //add category name to the added subcategory
        const category = categories.find(cat => cat.id === added.category_id);
        const addedWithCategoryName = {
          ...added,
          categories_name: category ? category.name : ""
        };
  
        setSubCategories((prev) => [...prev, addedWithCategoryName]);
      }
  
      close();
    } catch (error) {
      console.error(error);
      throw error;
    }
  };
  
  async function handleDeleteSubCategory(id: number) {
    const toastId = toast.loading("Deleting SubCategory...");
  
    try {
      await deleteSubCategory(id);
  
      setSubCategories((prev) => prev.filter((cat) => cat.id !== id));
      toast.success("SubCategory deleted successfully", { id: toastId });
    } catch (error: any) {
      console.error("Delete SubCategory error:", error);
  
      if (error.message.includes("existing products")) {
        toast.error("Cannot delete subcategory because there are products linked to it.", {
          id: toastId,
        });
      } else {
        toast.error(error.message || "Failed to delete subcategory", {
          id: toastId,
        });
      }
    }
  }
  


  return (
    <div className="p-8">
      <Toaster position="top-center" />
      <div className="flex justify-center items-center">
        <p className="text-2xl font-bold text-gray-800">All SubCategories</p>
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
            Add SubCategory
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
              subCategories={Subcategories}
              onEdit={handleEditClick}
              onDelete={handleDeleteSubCategory}
            />
          </div>
        </Center>
      )}

      <Drawer
        opened={opened}
        onClose={close}
        title={editingSubCategory ? "Edit SubCategory" : "Add SubCategory"}
        position="right"
        size="sm"
      >
        <SubCategoryForm
          subCategory={editingSubCategory}
          categories={categories}
          onSubmit={handleFormSubmit}
          onCancel={close}
        />
      </Drawer>
    </div>
  );
}

export default SubCategoriesCard;
