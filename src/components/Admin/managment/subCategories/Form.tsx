import React, { useState, useEffect } from "react";
import { TextInput, Button, FileInput, NativeSelect, Select } from "@mantine/core";
import { toast } from "react-hot-toast";
import { uploadImage } from "./services/SubCategoryService";

export default function SubCategoryForm({
  subCategory,
  onSubmit,
  onCancel,
  categories = [],
}) {
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [file, setFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (subCategory) {
      setName(subCategory.name || "");
      setImage(subCategory.image || "");
      setCategoryId(subCategory.category_id?.toString() || "");
    } else {
      setName("");
      setImage("");
      setCategoryId("");
    }
  }, [subCategory]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const uploadedUrl = file
        ? await uploadImage(file, subCategory?.image)
        : image;

      await onSubmit({
        name,
        image: uploadedUrl,
        category_id: Number(categoryId),
      });
      toast.success(subCategory ? "SubCategory updated" : "SubCategory added");
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
        label="SubCategory Name"
        labelProps={{ className: "mb-2" }}
        value={name}
        onChange={(e) => setName(e.currentTarget.value)}
        placeholder="Enter subCategory name"
        mb="sm"
        required
      />
   <Select
  variant="filled"
  radius="xl"
  label="Category"
  labelProps={{ className: "mb-2" }}
  value={categoryId}
  onChange={(val) => setCategoryId(val)}
  withAsterisk
  searchable
  placeholder="Select Category"
  data={categories.map((cat) => ({
    value: cat.id.toString(),
    label: cat.name,
  }))}
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
          {subCategory ? "Update SubCategory" : "Add SubCategory"}
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
