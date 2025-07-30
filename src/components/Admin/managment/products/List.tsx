'use client';
import React, { useState } from "react";
import {
  Card,
  Image,
  Text,
  Group,
  ActionIcon,
  Tooltip,
  Timeline,
  Badge,
} from "@mantine/core";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import { useModals } from "@mantine/modals";
import {
  FaEye,
  FaMinusCircle,
  FaPlusCircle,
  FaRegImages,
} from "react-icons/fa";
import ProductViewModal from "./model/ProductViewModal";
import EditSubCategoryModal from "./model/EditSubCategoryModal";
import { LuFolderTree } from "react-icons/lu";
import EditImegesModal from "./model/EditImegesModal";
import EditColorsModal from "./model/EditColorsModal";
import { MdFormatColorText } from "react-icons/md";
import { IoColorPaletteOutline } from "react-icons/io5";

export default function List({ product, onEdit, onDelete, onProductUpdate }) {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modalType, setModalType] = useState(null);
  const modals = useModals();

  const handleView = (product) => {
    setSelectedProduct(product);
    setModalType("view");
  };

  const handleEditSubCategory = (product) => {
    setSelectedProduct(product);
    setModalType("edit-sub");
  };

  const handleEditImgs = (product) => {
    setSelectedProduct(product);
    setModalType("edit-imgs");
  };
  const handleEditColors = (product) => {
    setSelectedProduct(product);
    setModalType("edit-colors");
  };

  const handleProductUpdate = (updatedProduct) => {
    if (onProductUpdate) {
      onProductUpdate(updatedProduct);
    }
    closeModal();
  };

  const closeModal = () => {
    setModalType(null);
    setSelectedProduct(null);
  };
  

// Inside the component


const handleDeleteConfirm = (productId) => {
  modals.openConfirmModal({
    title: "Confirm Deletion",
    centered: true,
    children: (
      <Text size="sm">
        Are you sure you want to delete this product? This action is
        irreversible.
      </Text>
    ),
    labels: { confirm: "Delete", cancel: "Cancel" },
    confirmProps: { color: "red" },
    onConfirm: () => onDelete(productId),
  });
};

  return (
    <>
      {product.map((product) => (
        <Card
          key={product.product_id}
          shadow="sm"
          padding="md"
          radius="lg"
          withBorder
          style={{
            maxWidth: 500,
            height: 300,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", gap: "1rem", flex: 1 }}>
            <div style={{ flex: 1 }}>
              <Timeline bulletSize={24}>
                <Timeline.Item
                  title={product.category_name}
                  bullet={<FaPlusCircle size={18} color="green" />}
                >
                  <Text c="dimmed" size="sm">
                    Category
                  </Text>
                </Timeline.Item>
                <Timeline.Item
                  title={product.subcategory_name}
                  bullet={<FaPlusCircle size={18} color="green" />}
                >
                  <Text c="dimmed" size="sm">
                    Sub Category
                  </Text>
                </Timeline.Item>
                <Timeline.Item
                  title={product.product_name}
                  bullet={<FaMinusCircle size={18} color="red" />}
                >
                  <Text c="dimmed" size="sm">
                    Product
                  </Text>
                </Timeline.Item>
              </Timeline>
            </div>
            <div
              style={{
                flexShrink: 0,
                width: 180,
                height: 220,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 4,
              }}
            >
              <Badge
                size="md"
                variant="gradient"
                gradient={{ from: "blue", to: "cyan", deg: 360 }}
              >
                {product.brand_name}
              </Badge>
              {product.product_images?.[0] ? (
                <Image
                  key={product.product_images[0].id}
                  src={`${product.product_images[0].image_url}`}
                  alt={product.product_name}
                  height={180}
                  width={180}
                  radius="md"
                  fit="cover"
                />
              ) : (
                <Text size="sm" color="red">
                  No image available
                </Text>
              )}
            </div>
          </div>

          <Group justify="center" mt="md">
            <Tooltip label="Edit SubCategory" withArrow radius={5}>
              <ActionIcon
                variant="light"
                radius="xl"
                color="blue"
                size="md"
                onClick={() => handleEditSubCategory(product)}
              >
                <LuFolderTree color="navy" style={{ fontSize: 22 }} />
              </ActionIcon>
            </Tooltip>

            <Tooltip label="Edit Images" withArrow radius={5}>
              <ActionIcon
                variant="light"
                radius="xl"
                color="blue"
                size="md"
                onClick={() => handleEditImgs(product)}
              >
                <FaRegImages color="green" style={{ fontSize: 22 }} />
              </ActionIcon>
            </Tooltip>

            <Tooltip label="Edit Colors" withArrow radius={5}>
              <ActionIcon
                variant="light"
                radius="xl"
                color="blue"
                size="md"
                onClick={() => handleEditColors(product)}
              >
                <IoColorPaletteOutline color="teal" style={{ fontSize: 22 }} />
              </ActionIcon>
            </Tooltip>

            <Tooltip label="View" withArrow radius={5}>
              <ActionIcon
                variant="light"
                radius="xl"
                color="blue"
                size="md"
                onClick={() => handleView(product)}
              >
                <FaEye style={{ fontSize: 22 }} />
              </ActionIcon>
            </Tooltip>

            <Tooltip label="Edit" withArrow radius={5}>
              <ActionIcon
                variant="light"
                radius="xl"
                color="orange"
                size="md"
                onClick={() => onEdit(product)}
              >
                <BorderColorIcon style={{ fontSize: 22 }} />
              </ActionIcon>
            </Tooltip>

            <Tooltip label="Delete" withArrow radius={5}>
              <ActionIcon
                variant="light"
                radius="xl"
                color="red"
                size="xs"
                style={{
                  width: 30,
                  height: 30,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
onClick={() => handleDeleteConfirm(product.product_id)}
              >
                <DeleteForeverIcon style={{ fontSize: 22 }} />
              </ActionIcon>
            </Tooltip>
          </Group>
        </Card>
      ))}

      <ProductViewModal
        opened={modalType === "view"}
        onClose={closeModal}
        product={selectedProduct}
      />

      <EditSubCategoryModal
        opened={modalType === "edit-sub"}
        onClose={closeModal}
        product={selectedProduct}
      />

      <EditImegesModal
        opened={modalType === "edit-imgs"}
        onClose={closeModal}
        product={selectedProduct}
        onProductUpdate={handleProductUpdate}
      />
      <EditColorsModal
        opened={modalType === "edit-colors"}
        onClose={closeModal}
        product={selectedProduct}
      />
    </>
  );
}
