"use client";
import React, { useState, useEffect } from "react";
import { useDisclosure } from "@mantine/hooks";
import { Drawer, Center, Loader } from "@mantine/core";
import { Toaster, toast } from "react-hot-toast";
import AttrForm from "./Form";  // نموذج التعديل
import List from "./List";
import { fetchSubCategories } from "../subCategories/services/SubCategoryService";
import AddAttrForm from "./AddAttrForm";

function AttrCard() {
  const [opened, { open, close }] = useDisclosure(false);
  const [editingAttr, setEditingAttr] = useState(null);  // لتعديل
  const [addingAttrForSubCat, setAddingAttrForSubCat] = useState(null);  // لإضافة جديد
  const [subCategories, setSubCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadAttrs() {
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
    loadAttrs();
  }, []);

  const handleEditClick = (category) => {
    setEditingAttr(category);
    setAddingAttrForSubCat(null);
    open();
  };

  const handleAddClick = (subCategory) => {
    setAddingAttrForSubCat(subCategory);
    setEditingAttr(null);
    open();
  };

  const handleClose = () => {
    setEditingAttr(null);
    setAddingAttrForSubCat(null);
    close();
  };

  return (
    <div className="p-8">
      <Toaster position="top-center" />
      <div className="flex justify-center items-center">
        <p className="text-2xl font-bold text-gray-800">
          Manage Attributes by Subcategories
        </p>
      </div>

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
              subCategories={subCategories}
              onEdit={handleEditClick}
              onAdd={handleAddClick}
            />
          </div>
        </Center>
      )}

      <Drawer
        opened={opened}
        onClose={handleClose}
        title={
          editingAttr
            ? `Edit Attributes `
            : addingAttrForSubCat
            ? `Add New Attribute `
            : ""
        }
        position="right"
        size="sm"
      >
        {editingAttr && (
          <AttrForm
            subCategory={editingAttr}
            onCancel={handleClose}
          />
        )}
        {addingAttrForSubCat && (
          <AddAttrForm
            subCategory={addingAttrForSubCat}
            onCancel={handleClose}
            onSaved={handleClose}  
          />
        )}
      </Drawer>
    </div>
  );
}

export default AttrCard;
