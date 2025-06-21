import React, { useState, useEffect } from "react";
import {
  Modal,
  Image,
  Text,
  Group,
  Stack,
  FileInput,
  Button,
  ActionIcon,
  SimpleGrid,
  Box,
} from "@mantine/core";
import {
  uploadImage,
  AddProductImage,
  DeleteProductImage,
} from "../services/Products";
import { FaTrashAlt } from "react-icons/fa";

interface ProductImage {
  id: number;
  image_url: string;
}

interface Product {
  product_id: number;
  product_name: string;
  product_description: string;
  product_images: ProductImage[];
}

interface EditImagesModalProps {
  opened: boolean;
  onClose: () => void;
  product: Product | null;
  onProductUpdate: (updatedProduct: Product) => void;
}

export default function EditImagesModal({
  opened,
  onClose,
  product,
  onProductUpdate,
}: EditImagesModalProps) {
  const [mainImage, setMainImage] = useState<string | null>(null);
  const [newImage, setNewImage] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (product?.product_images?.length > 0) {
      setMainImage(product.product_images[0].image_url);
    }
  }, [product]);

  if (!product) return null;

  const handleUploadNewImage = async () => {
    if (!newImage) {
      alert("Please select an image to upload.");
      return;
    }

    setIsUploading(true);
    try {
      const imageUrl = await uploadImage(newImage);
      console.log("🚀 ~ imageUrl:", imageUrl); // <-- أضف هذا السطر

      const updatedProductData = await AddProductImage(
        product.product_id,
        imageUrl
      );

      onProductUpdate({
        ...product,
        product_images: updatedProductData.product_images,
      });

      setNewImage(null);
    } catch (error) {
      console.error("Error uploading image:", error);
      alert(
        `Failed to upload image: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteImage = async (imageId: number, imageUrl: string) => {
    if (!confirm("Are you sure you want to delete this image?")) return;

    setIsDeleting(true);
    try {
      const updatedProductData = await DeleteProductImage(imageId);

      onProductUpdate({
        ...product,
        product_images: updatedProductData.product_images,
      });

      if (mainImage === imageUrl) {
        setMainImage(updatedProductData.product_images[0]?.image_url ?? null);
      }
    } catch (error) {
      console.error("Error deleting image:", error);
      alert(
        `Failed to delete image: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    } finally {
      setIsDeleting(false);
    }
  };

  return (
<Modal
  opened={opened}
  onClose={onClose}
  title="Product Images"
  size="lg"
  centered
  overlayProps={{
    backgroundOpacity: 0.55,
    blur: 3,
  }}
>
  <Stack spacing="md">
    {/* Product title */}
    <Text size="xl" fw={700}>
      {product.product_name}
    </Text>

  
    <Stack spacing="xs" mt="md" >
      <Text size="md" fw={600}>
        Upload New Image
      </Text>
      <FileInput
      variant="filled"
        radius="xl"
        label="Select image"
        placeholder="No file selected"
        value={newImage}
        onChange={setNewImage}
        clearable
        disabled={isUploading}
        accept="image/*"
      />
      <Button
        onClick={handleUploadNewImage}
        disabled={isUploading || !newImage}
        loading={isUploading}
      >
        Upload Image
      </Button>
    </Stack>

    {/* Main image */}
    {mainImage && (
      <Image
        src={mainImage}
        alt="Main Product Image"
        height={150}
        radius="md"
        fit="cover"
        style={{ width: "100%" }}
      />
    )}

    {/* Grid of thumbnails */}
    <SimpleGrid cols={4} spacing="xs" breakpoints={[{ maxWidth: 'sm', cols: 2 }]}>
      {product.product_images?.map(({ id, image_url }) => (
        <Box
          key={id}
          style={{ position: "relative", cursor: "pointer" }}
          onClick={() => setMainImage(image_url)}
        >
          <Image
            src={image_url}
            alt="Thumbnail"
            height={70}
            radius="sm"
            fit="cover"
            style={{
              border: mainImage === image_url ? "2px solid #1c7ed6" : "1px solid #ccc",
              width: "100%",
            }}
          />
          <ActionIcon
            color="red"
            size="xs"
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteImage(id, image_url);
            }}
            style={{ position: "absolute", top: 2, right: 2 }}
            disabled={isDeleting}
          >
            <FaTrashAlt size={10} />
          </ActionIcon>
        </Box>
      ))}
    </SimpleGrid>

    {/* Upload section */}

  </Stack>
</Modal>


  

  );
}
