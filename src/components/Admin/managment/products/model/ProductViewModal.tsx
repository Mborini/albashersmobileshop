import React from "react";
import { Modal, Image, Text, Group, List } from "@mantine/core";
import { FaCheckCircle } from "react-icons/fa";
import { VscError } from "react-icons/vsc";
export default function ProductViewModal({ opened, onClose, product }) {
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
      {attributesArray.length > 0 ? (
  <List spacing="xs" size="sm" withPadding>
    {attributesArray.map((attr, index) => (
      <List.Item key={index}>
        <div className="flex items-center gap-2">
          <strong>{attr.name}:</strong>{" "}
          {attr.value === "true" ? (
            <>
              <FaCheckCircle size={18} color="green" />
              <span>Yes</span>
            </>
          ) : attr.value === "false" ? (
            <>
              <VscError size={18} color="red" />
              <span>No</span>
            </>
          ) : (
            <span>{String(attr.value)}</span>
          )}
        </div>
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
