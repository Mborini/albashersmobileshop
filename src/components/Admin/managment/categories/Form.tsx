import React, { useState, useEffect } from "react";
import { TextInput, Button, FileInput } from "@mantine/core";
import { toast } from "react-hot-toast";
import { uploadImage } from "./services/categoryService";

export default function CategoryForm({ category, onSubmit, onCancel }) {
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [file, setFile] = useState(null);

  useEffect(() => {
    if (category) {
      setName(category.name || "");
      setImage(category.image || "");
    } else {
      setName("");
      setImage("");
    }
  }, [category]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const uploadedUrl = file
      ? await uploadImage(file, category?.image)
      : image;
      await onSubmit({ name, image: uploadedUrl });
      toast.success(category ? "Category updated" : "Category added"),
        {
          position: "top-center",
        };
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <TextInput
      variant="filled"
        radius="xl"
        label="Category Name"
          labelProps={{ className: "mb-2 " }}

        value={name}
        onChange={(e) => setName(e.currentTarget.value)}
        placeholder="Enter category name"
        mb="sm"
        required
      />
      <FileInput
        variant="filled"
        radius="xl"
        label="Image"
        placeholder="Upload image"
        onChange={setFile}
        accept="image/*"
      />
        
      
      <div className="flex items-center justify-around">
        <Button
          type="submit"
          variant="light"
          mt="lg"
          color="blue"
          loading={isSubmitting}
          disabled={isSubmitting}
          radius="xl"
        >
          {category ? "Update Category" : "Add Category"}
        </Button>
        <Button
          variant="light"
          mt="lg"
          onClick={onCancel}
          disabled={isSubmitting}
          color="red"
          radius="xl"

        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
