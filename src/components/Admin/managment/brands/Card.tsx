"use client";
import React, { useState, useEffect } from "react";
import { useDisclosure } from "@mantine/hooks";
import { Drawer, Divider, Center, Loader, Button } from "@mantine/core";
import { Toaster, toast } from "react-hot-toast";
import BrandForm from "./Form";
import List from "./List";
import {
  fetchBrands,
  addBrand,
  updateBrand,
  deleteBrand,
} from "./services/BrandsService";
function BrandsCard() {
  const [opened, { open, close }] = useDisclosure(false);
  const [editingBrand, setEditingBrand] = useState(null);
  const [loading, setLoading] = useState(false);
  const [brands, setBrands] = useState([]);

  useEffect(() => {
    async function loadBrands() {
      setLoading(true);
      try {
        const data = await fetchBrands();
        setBrands(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    loadBrands();
  }, []);

  const handleAddClick = () => {
    setEditingBrand(null);
    open();
  };

  const handleEditClick = (brand) => {
    setEditingBrand(brand);
    open();
  };

  const handleFormSubmit = async (formData) => {
    try {
      if (editingBrand) {
        const updated = await updateBrand(editingBrand.id, formData);
        setBrands((prev) =>
          prev.map((brand) => (brand.id === updated.id ? updated : brand))
        );
      } else {
        const added = await addBrand(formData);
        setBrands((prev) => [...prev, added]);
      }
      close();
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  async function handleDeleteBrand(id: number) {
    const toastId = toast.loading("Deleting Brand...");
  
    try {
      await deleteBrand(id);
  
      setBrands((prev) => prev.filter((brand) => brand.id !== id));
      toast.success("Brand deleted successfully", { id: toastId });
    } catch (error: any) {
      console.error("Delete Brand error:", error);
  
      // إذا كان الخطأ من الـ API مع رسالة في JSON نقدر نفك الـ error.message من response
      if (error.message && error.message.includes("existing products")) {
        toast.error("Cannot delete brand because there are products linked to it.", {
          id: toastId,
        });
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
        <p className="text-2xl font-bold text-gray-800">All Brands</p>
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
            Add Brand
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
              brand={brands}
              onEdit={handleEditClick}
              onDelete={handleDeleteBrand}
            />
          </div>
        </Center>
      )}

      <Drawer
        opened={opened}
        onClose={close}
        title={editingBrand ? "Edit Brand" : "Add Brand"}
        position="right"
        size="sm"
      >
        <BrandForm
  brand={editingBrand}
  onSubmit={handleFormSubmit}
  onCancel={close}
/>

      </Drawer>
    </div>
  );
}

export default BrandsCard;
