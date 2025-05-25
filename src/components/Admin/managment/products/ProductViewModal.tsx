import React from "react";
import { Modal, Image, Text, Group, List } from "@mantine/core";

export default function ProductViewModal({ opened, onClose, product }) {
  if (!product) return null;

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
          src={product.image || "/images/products/product-2-bg-2.png"}
          alt={product.product_name}
          height={150}
          width={150}
          radius="md"
          fit="cover"
        />
        <div>
          <Text size="lg">{product.product_name}</Text>
          <Text size="sm" c="dimmed">
            {product.brand_name}
          </Text>
          <Text size="sm" c="dimmed">
            {product.category_name} / {product.subcategory_name}
          </Text>
        </div>
      </Group>

      <Text mb="xs" fw={500}>
        Description
      </Text>
      <Text mb="md" size="sm">
        {product.description || "No description provided."}
      </Text>

      <Text mb="xs" fw={500}>
        Attributes
      </Text>
      {product.attributes && product.attributes.length > 0 ? (
        <List spacing="xs" size="sm" withPadding>
          {product.attributes.map((attr, index) => (
            <List.Item key={index}>
              <strong>{attr.name}:</strong> {attr.value}
            </List.Item>
          ))}
        </List>
      ) : (
        <Text size="sm" c="dimmed">
          No attributes available.
        </Text>
      )}
    </Modal>
  );
}
