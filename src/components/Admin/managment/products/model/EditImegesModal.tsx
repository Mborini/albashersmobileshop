import React from "react";
import { Modal, Image, Text, Group, List } from "@mantine/core";

export default function EditImegesModal({ opened, onClose, product }) {
  if (!product) return null;
  const attributesArray = product.attributes
    ? Object.entries(product.attributes).map(([key, value]) => ({
        name: key,
        value: value,
      }))
    : [];
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Product Details"
      size="lg"
      centered
      overlayProps={{
        backgroundOpacity: 0.55,
        blur: 3,
      }}
    >
      <Group style={{ marginBottom: 15 }}>
        <Image
          src={`/images/products/${product.product_images[0]}`}
          alt={product.product_name}
          height={150}
          width={150}
          radius="md"
          fit="cover"
        />
       
      </Group>
    </Modal>
  );
}
