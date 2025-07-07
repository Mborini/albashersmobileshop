"use client";
import React, { useState, useEffect } from "react";
import { useDisclosure } from "@mantine/hooks";
import { Drawer, Divider, Center, Loader, Button } from "@mantine/core";
import { TextInput, Select, Group } from "@mantine/core";
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

  // حالات الفلترة
  const [categoryFilter, setCategoryFilter] = useState("");
  const [subCategoryFilter, setSubCategoryFilter] = useState("");

  useEffect(() => {
    async function loadSubCategories() {
      setLoading(true);
      try {
        const data = await fetchSubCategories();

        // ربط اسم الكاتيجوري مع كل سب كاتيجوري (ضروري)
        const dataWithCategoryName = data.map((sub) => {
          const cat = categories.find((c) => c.id === sub.category_id);
          return {
            ...sub,
            categories_name: cat ? cat.name : "",
          };
        });

        setSubCategories(dataWithCategoryName);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    loadSubCategories();
  }, [categories]); // تحديث عند تغيير categories

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
        const updated = await updateSubCategory(
          editingSubCategory.id,
          formData
        );

        // تحديث اسم الكاتيجوري المرتبط
        const category = categories.find(
          (cat) => cat.id === updated.category_id
        );
        const updatedWithCategoryName = {
          ...updated,
          categories_name: category ? category.name : "",
        };

        setSubCategories((prev) =>
          prev.map((cat) =>
            cat.id === updated.id ? updatedWithCategoryName : cat
          )
        );
      } else {
        const added = await addSubCategory(formData);

        // اضافة اسم الكاتيجوري
        const category = categories.find((cat) => cat.id === added.category_id);
        const addedWithCategoryName = {
          ...added,
          categories_name: category ? category.name : "",
        };

        setSubCategories((prev) => [...prev, addedWithCategoryName]);
      }

      close();
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  async function handleDeleteSubCategory(id) {
    const toastId = toast.loading("Deleting SubCategory...");

    try {
      await deleteSubCategory(id);

      setSubCategories((prev) => prev.filter((cat) => cat.id !== id));
      toast.success("SubCategory deleted successfully", { id: toastId });
    } catch (error) {
      console.error("Delete SubCategory error:", error);

      if (error.message.includes("existing products")) {
        toast.error(
          "Cannot delete subcategory because there are products linked to it.",
          {
            id: toastId,
          }
        );
      } else {
        toast.error(error.message || "Failed to delete subcategory", {
          id: toastId,
        });
      }
    }
  }

  // تطبيق الفلترة
  const filteredSubCategories = Subcategories.filter((sub) => {
    const matchCategory = categoryFilter
      ? sub.categories_name.toLowerCase().includes(categoryFilter.toLowerCase())
      : true;

    const matchSubCategory = subCategoryFilter
      ? sub.name.toLowerCase().includes(subCategoryFilter.toLowerCase())
      : true;

    return matchCategory && matchSubCategory;
  });

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

      <Group mb="md">
        <TextInput
          variant="filled"
          radius="xl"
          placeholder="Filter by SubCategory Name"
          value={subCategoryFilter}
          onChange={(e) => setSubCategoryFilter(e.currentTarget.value)}
          style={{ width: 200 }}
        />

        <Select
          data={[
            { value: "", label: "All Categories" },
            ...categories.map((cat) => ({ value: cat.name, label: cat.name })),
          ]}
          variant="filled"
          radius="xl"
          value={categoryFilter}
          onChange={setCategoryFilter}
          style={{ width: 200 }}
          placeholder="Select Category"
          searchable
          clearable
        />
      </Group>

      {loading ? (
        <Center mt="xl">
          <Loader size="lg" />
        </Center>
      ) : (
        <Center>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-[1200px] mt-4">
            <List
              subCategories={filteredSubCategories}
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
