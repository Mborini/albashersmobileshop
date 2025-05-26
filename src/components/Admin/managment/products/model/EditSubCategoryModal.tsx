import React from "react";
import { Modal, Image, Text, Group, List } from "@mantine/core";

export default function EditSubCategoryModal({ opened, onClose, product }) {
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
     

      <Text mb="xs" fw={500}>
        Attributes
      </Text>
      {attributesArray.length > 0 ? (
        <List spacing="xs" size="sm" withPadding>
          {attributesArray.map((attr, index) => (
            <List.Item key={index}>
              <strong>{attr.name}:</strong> <p>{attr.value} </p>
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
