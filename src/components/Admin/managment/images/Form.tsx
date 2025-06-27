"use client";

import {
  Button,
  Group,
  Stack,
  TextInput,
  Textarea,
  NumberInput,
  FileInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useEffect, useState } from "react";
import { uploadImage } from "./services/adsServices";

export default function ImagesForm({ image, onSubmit, onCancel }) {
  const form = useForm({
    initialValues: {
      name: "",
      image: "",
      price: 0,
      discounted_Price: 0,
      description: "",
    },
  });
  const [file, setFile] = useState(null);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (image) {
      form.setValues({
        name: image.name || "",
        image: image.image || "",
        price: image.price || 0,
        discounted_Price: image.discounted_Price || 0,
        description: image.description || "",
      });
    } else {
      form.reset();
    }
  }, [image]);
  
  
  const handleSubmit = async (values) => {
    setLoading(true);
    try {
     
      let imageUrl = values.image;
      if (file) {
        imageUrl = await uploadImage(file, image?.image);
      }
  
      await onSubmit({ ...values, image: imageUrl });
  
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };
  

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Stack>
        <TextInput
          label="Name"
          placeholder="Enter name"
          {...form.getInputProps("name")}
          disabled={loading}
          required
        />
    
           <FileInput
        variant="filled"
        radius="xl"
        label="Image"
        placeholder="Upload image"
        {...form.getInputProps("image")}
        onChange={setFile}
        disabled={loading}
        accept="image/*"
      />
        <NumberInput
          label="Price"
          placeholder="Enter price"
          {...form.getInputProps("price")}
          disabled={loading}
          min={0}
          required
        />
        <NumberInput
          label="Discounted Price"
          placeholder="Enter discounted price"
          {...form.getInputProps("discounted_Price")}
          disabled={loading}
          min={0}
          required
        />
        <Textarea
          label="Description"
          placeholder="Enter description"
          {...form.getInputProps("description")}
          disabled={loading}
          required
          minRows={3}
        />

        <Group justify="flex-end" mt="md">
          <Button variant="outline" onClick={onCancel} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" loading={loading}>
            {image ? "Update" : "Create"}
          </Button>
        </Group>
      </Stack>
    </form>
  );
}
