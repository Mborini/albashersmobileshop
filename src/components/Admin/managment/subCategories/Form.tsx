import React, { useState, useEffect } from "react";
import { TextInput, Button, FileInput, NativeSelect } from "@mantine/core";
import { toast } from "react-hot-toast";
export default function SubCategoryForm({
  subCategory,
  onSubmit,
  onCancel,
  categories = [],
}) {
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [categoryId, setCategoryId] = useState("");
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
      await onSubmit({ name, image, category_id: Number(categoryId) });
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
        labelProps={{ className: "mb-2 " }}
        value={name}
        onChange={(e) => setName(e.currentTarget.value)}
        placeholder="Enter subCategory name"
        mb="sm"
        required
      />
     <NativeSelect
  variant="filled"
  radius="xl"
  label="Category"
  labelProps={{ className: "mb-2" }}
  value={categoryId}
  onChange={(e) => setCategoryId(e.currentTarget.value)}
  withAsterisk
  data={[
    { value: "", label: "Select Category", disabled: true }, 
    ...categories.map((cat) => ({
      value: cat.id.toString(),
      label: cat.name,
    })),
  ]}
  
  required
/>


      <TextInput
        variant="filled"
        radius="xl"
        label="Image URL"
        value={image}
        onChange={(e) => setImage(e.currentTarget.value)}
        placeholder="Enter image URL"
        required
        mt="lg"
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
