import React, { useState, useEffect } from "react";
import {
  TextInput,
  Button,
  Group,
  Box,
  Select,
  Checkbox,
  Text,
  NumberInput,
  Textarea,
} from "@mantine/core";
import { toast } from "react-hot-toast";
import { fetchAttributes } from "./services/Products";

interface ProductFormProps {
  product?: any;
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
  subcategories: { id: number; name: string }[];
  brands: { id: number; name: string }[];
}

export default function ProductForm({
  product,
  onSubmit,
  onCancel,
  subcategories,
  brands,
}: ProductFormProps) {
  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");
  const [attributes, setAttributes] = useState<any[]>([]);
  const [attributeValues, setAttributeValues] = useState<
    Record<number, string>
  >({});
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState<
    string | null
  >(null);
  const [selectedBrandId, setSelectedBrandId] = useState<string | null>(null);
  const [price, setPrice] = useState<number | null>(0);
  const [discountedPrice, setDiscountedPrice] = useState<number | null>(0);

  useEffect(() => {
    if (product) {
      setProductName(product.product_name || "");
      setDescription(product.description || "");
      setPrice(product.price ?? 0);
      setDiscountedPrice(product.discountedPrice ?? 0);

      const subcat = subcategories.find(
        (s) => s.name === product.subcategory_name
      );
      const brand = brands.find((b) => b.name === product.brand_name);

      setSelectedSubcategoryId(subcat?.id?.toString() || null);
      setSelectedBrandId(brand?.id?.toString() || null);
    } else {
      setProductName("");
      setDescription("");
      setPrice(0);
      setDiscountedPrice(0);
      setSelectedSubcategoryId(null);
      setSelectedBrandId(null);
    }
  }, [product]);

  async function loadAttributes(id: string | null) {
    if (!id) return;
    try {
      const attributesData = await fetchAttributes(id);
      setAttributes(attributesData);
      setAttributeValues({});
    } catch (error) {
      console.error(error);
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!productName.trim()) return toast.error("Product name is required");
    if (!selectedBrandId) return toast.error("Brand is required");
    if (!selectedSubcategoryId && !product)
      return toast.error("Subcategory is required");
    if (!description.trim()) return toast.error("Description is required");
    if (price! < 0) return toast.error("Price must be non-negative");
    if (discountedPrice! < 0)
      return toast.error("Discount must be non-negative");

    if (!product) {
      for (const value of Object.values(attributeValues)) {
        if (!value.trim())
          return toast.error("All selected attribute values must be filled");
      }
    }

    const formData: any = {
      title: productName.trim(),
      brand_id: Number(selectedBrandId),
      description: description.trim(),
      price,
      discountedPrice,
    };

    if (!product) {
      formData.subcategory_id = Number(selectedSubcategoryId);
      formData.attributes = Object.entries(attributeValues).map(
        ([id, value]) => ({
          attribute_id: Number(id),
          value,
        })
      );
    }

    try {
      await onSubmit(formData);
      toast.success(product ? "Product updated" : "Product added");
    } catch (error) {
      console.error(error);
      toast.error("Failed to submit product");
    }
  };

  return (
    <Box maw={600} mx="auto" px="md">
      <form onSubmit={handleSubmit}>
        <TextInput
          variant="filled"
          radius="xl"
          label="Product Name"
          value={productName}
          onChange={(e) => setProductName(e.currentTarget.value)}
          placeholder="Enter product name"
          mb="sm"
          required
          withAsterisk
        />

        <Select
          variant="filled"
          radius="xl"
          mb="sm"
          withAsterisk
          label="Subcategory"
          data={subcategories.map((sub) => ({
            value: sub.id.toString(),
            label: sub.name,
          }))}
          value={selectedSubcategoryId}
          onChange={(value) => {
            if (!product) {
              setSelectedSubcategoryId(value);
              loadAttributes(value);
            }
          }}
          disabled={!!product}
          required
        />
        <Select
          variant="filled"
          radius="xl"
          mb="sm"
          label="Brand"
          data={brands.map((brand) => ({
            value: brand.id.toString(),
            label: brand.name,
          }))}
          value={selectedBrandId}
          onChange={setSelectedBrandId}
          mb="sm"
          required
          withAsterisk
        />

        <NumberInput
          variant="filled"
          radius="xl"
          mb="sm"
          label="Price"
          value={price}
          onChange={setPrice}
          placeholder="Enter product price"
          withAsterisk
          min={0}
        />
        <NumberInput
          variant="filled"
          radius="xl"
          label="Discounted Price"
          value={discountedPrice}
          onChange={setDiscountedPrice}
          placeholder="Enter discounted price"
          mb="sm"
          withAsterisk
          min={0}
        />
        <Textarea
          size="sm"
          variant="filled"
          radius="lg"
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.currentTarget.value)}
          placeholder="Enter product description"
          mb="sm"
          withAsterisk
        />

        {!product && attributes.length > 0 && (
          <Box mt="md">
            <Text mb="xs" size="md">
              Attributes
            </Text>
            {attributes.map((attr) => (
              <Group key={attr.id} align="center" justify="space-between">
                <Checkbox
                  label={attr.name}
                  radius="xl"
                  mb="xs"
                  size="xs"
                  id={`attr-${attr.id}`}
                  checked={attributeValues[attr.id] !== undefined}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    setAttributeValues((prev) => {
                      const updated = { ...prev };
                      if (!checked) {
                        delete updated[attr.id];
                      } else {
                        updated[attr.id] = "";
                      }
                      return updated;
                    });
                  }}
                />
                {attributeValues[attr.id] !== undefined && (
                  <TextInput
                    radius="xl"
                    size="xs"
                    value={attributeValues[attr.id]}
                    onChange={(e) =>
                      setAttributeValues((prev) => ({
                        ...prev,
                        [attr.id]: e.target.value,
                      }))
                    }
                    placeholder={`Value for ${attr.name}`}
                  />
                )}
              </Group>
            ))}
          </Box>
        )}

        <Group mt="xl" justify="flex-end">
          <Button variant="light" color="gray" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">
            {product ? "Update Product" : "Add Product"}
          </Button>
        </Group>
      </form>
    </Box>
  );
}
