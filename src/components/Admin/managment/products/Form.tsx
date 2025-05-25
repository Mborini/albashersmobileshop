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
} from "@mantine/core";
import { toast } from "react-hot-toast";
import { fetchAttributes } from "./services/Products";

interface ProductFormProps {
  product?: any;
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
  subcategories: { id: number; name: string }[];
  brands: { name: string }[];
}

export default function ProductForm({
  product,
  onSubmit,
  onCancel,
  subcategories,
  brands,
}: ProductFormProps) {
  const [productName, setProductName] = useState("");
  const [image, setImage] = useState("");
  const [brandName, setBrandName] = useState("");
  const [subcategoryName, setSubcategoryName] = useState("");
  const [description, setDescription] = useState("");
  const [attributes, setAttributes] = useState<any[]>([]);
  const [attributeValues, setAttributeValues] = useState<Record<number, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState<string | null>(null);
  const [Price, setPrice] = useState<number | null>(0);
  const [discountedPrice, setDiscountedPrice] = useState<number | null>(0);
  const [selectedBrandId, setSelectedBrandId] = useState<string | null>(null);

  useEffect(() => {
    if (product) {
      setProductName(product.product_name || "");
      setImage(product.image || "");
      setBrandName(product.brand_name || "");
      setSubcategoryName(product.subcategory_name || "");
      setDescription(product.description || "");
      setPrice(product.price ?? 0);
      setDiscountedPrice(product.discountedPrice ?? 0);
    } else {
      setProductName("");
      setImage("");
      setBrandName("");
      setSubcategoryName("");
      setDescription("");
      setPrice(0);
      setDiscountedPrice(0);
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
  
    // Validate form
    if (!productName.trim()) return toast.error("Product name is required");
    if (!image.trim()) return toast.error("Image URL is required");
    if (!brandName) return toast.error("Brand is required");
    if (!subcategoryName) return toast.error("Subcategory is required");
    if (!description.trim()) return toast.error("Description is required");
    if (Price < 0) return toast.error("Price must be non-negative");
    if (discountedPrice < 0) return toast.error("Discount must be non-negative");
  
    for (const value of Object.values(attributeValues)) {
      if (!value.trim()) return toast.error("All selected attribute values must be filled");
    }
  
    const attributes = Object.entries(attributeValues).map(([id, value]) => ({
      attribute_id: Number(id),
      value,
    }));
  
    const formData = {
      title: productName.trim(),
      image: image.trim(),
      brand_id: Number(selectedBrandId),
      subcategory_id: Number(selectedSubcategoryId),
      description: description.trim(),
      price: Price,
      discountedPrice: discountedPrice,
      attributes,
    };
    
  
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

        <TextInput
          variant="filled"
          radius="xl"
          label="Image URL"
          value={image}
          onChange={(e) => setImage(e.currentTarget.value)}
          placeholder="Enter image URL"
          mb="sm"
          required
          withAsterisk
        />

        <Select
          variant="filled"
          radius="xl"
          mb="sm"
          withAsterisk
          label="Subcategory Name"
          placeholder="Choose"
          value={selectedSubcategoryId}
          onChange={(value) => {
            setSelectedSubcategoryId(value);
            setSubcategoryName(
              subcategories.find((s) => s.id.toString() === value)?.name || ""
            );
            loadAttributes(value);
          }}
          data={subcategories.map((subcategory) => ({
            value: subcategory.id.toString(),
            label: subcategory.name,
          }))}
        />

<Select
  variant="filled"
  radius="xl"
  mb="sm"
  label="Brand"
  placeholder="Choose"
  withAsterisk
  value={selectedBrandId}
  onChange={(value) => {
    setSelectedBrandId(value);
    setBrandName(
      brands.find((b) => b.id.toString() === value)?.name || ""
    );
  }}
  data={brands.map((brand) => ({
    value: brand.id.toString(), 
    label: brand.name,
  }))}
/>

        <NumberInput
          variant="filled"
          radius="xl"
          mb="sm"
          label="Price"
          value={Price}
          onChange={(value) => setPrice(value )}
          placeholder="Enter product price"
          withAsterisk
          min={0}
        />
        <NumberInput
          variant="filled"
          radius="xl"
          label="Discounted Price"
          value={discountedPrice}
          onChange={(value) => setDiscountedPrice(value)}
          placeholder="Enter product discounted price"
          mb="sm"
          withAsterisk
          min={0}
        />
        <TextInput
          variant="filled"
          radius="xl"
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.currentTarget.value)}
          placeholder="Enter product description"
          mb="sm"
          withAsterisk
        />

        {attributes.length > 0 && (
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
                    variant="filled"
                    radius="xl"
                    size="xs"
                    mb="xs"
                    placeholder={`Enter ${attr.name}`}
                    value={attributeValues[attr.id]}
                    onChange={(e) => {
                      const value = e.target.value;
                      setAttributeValues((prev) => ({
                        ...prev,
                        [attr.id]: value,
                      }));
                    }}
                  />
                )}
              </Group>
            ))}
          </Box>
        )}

        <Group mt="md">
          <Button
            type="submit"
            variant="light"
            color="blue"
            loading={isSubmitting}
            disabled={isSubmitting}
            radius="xl"
          >
            {product ? "Update Product" : "Add Product"}
          </Button>
          <Button
            variant="light"
            color="red"
            onClick={onCancel}
            disabled={isSubmitting}
            radius="xl"
          >
            Cancel
          </Button>
        </Group>
      </form>
    </Box>
  );
}
