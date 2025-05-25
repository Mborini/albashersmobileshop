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
  Button,
} from "@mantine/core";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import { FaEye, FaMinusCircle, FaPlusCircle } from "react-icons/fa";
import { useDisclosure } from "@mantine/hooks";
import ProductViewModal from "./ProductViewModal";

export default function List({ product, onEdit, onDelete }) {
  const [opened, { open, close }] = useDisclosure(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleView = (product) => {
    setSelectedProduct(product);
    open();
  };

  return (
    <>
      {product.map((product) => (
        <Card
          key={product.id}
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
              <Image
                src={product.image || "/images/products/product-2-bg-2.png"}
                alt={product.product_name}
                height={180}
                width={180}
                radius="md"
                fit="cover"
              />
            </div>
          </div>

          <Group justify="center" mt="md">
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
                onClick={() => onDelete(product.id)}
              >
                <DeleteForeverIcon style={{ fontSize: 22 }} />
              </ActionIcon>
            </Tooltip>
          </Group>
        </Card>
      ))}

      <ProductViewModal
        opened={opened}
        onClose={close}
        product={selectedProduct}
      />
    </>
  );
}
