import React, { useState, useEffect } from "react";
import { TextInput, Button, FileInput, Checkbox } from "@mantine/core";
import { toast } from "react-hot-toast";
import { uploadImage } from "./services/BrandsService";

export default function BrandForm({ brand, onSubmit, onCancel }) {
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCommon, setIsCommon] = useState(false);
  const [file, setFile] = useState(null);
  useEffect(() => {
    if (brand) {
      setName(brand.name || "");
      setImage(brand.image || "");
      setIsCommon(brand.isCommon ?? false);
    } else {
      setName("");
      setImage("");
      setIsCommon(false);
    }
  }, [brand]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const uploadedUrl = file ? await uploadImage(file, brand?.image) : image;

      await onSubmit({
        name,
        image: uploadedUrl,
        isCommon,
        oldImageUrl: brand?.image,
      });
      toast.success(brand ? "Brand updated" : "Brand added"),
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
        label="Brand Name"
        labelProps={{ className: "mb-2 " }}
        value={name}
        onChange={(e) => setName(e.currentTarget.value)}
        placeholder="Enter Brand name"
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
      <Checkbox
        label="Is Common"
        color="indigo"
        variant="outline"
        radius="xl"
        mt="lg"
        checked={isCommon}
        onChange={(e) => setIsCommon(e.currentTarget.checked)}
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
          {brand ? "Update Brand" : "Add Brand"}
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
