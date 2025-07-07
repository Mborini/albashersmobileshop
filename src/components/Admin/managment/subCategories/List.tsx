import React from "react";
import {
  Card,
  Image,
  Text,
  Badge,
  Group,
  ActionIcon,
  Tooltip,
} from "@mantine/core";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import SubCategoriesTimeline from "./CategoriesTimeline";

export default function List({ subCategories, onEdit, onDelete }) {
  return (
    <>
      {subCategories.map((subCategory) => (
        <Card
          key={subCategory.id}
          shadow="sm"
          padding="md"
          radius="lg"
          withBorder
          style={{
            maxWidth: 400,
            height: "auto",
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
          }}
        >
          {/* الصورة والتايملاين جنب بعض */}
          <div style={{ display: "flex", gap: "1rem" }}>
            {/* الصورة */}
            <div style={{ flex: "0 0 50%" }}>
              <Image
                src={subCategory.image}
                alt={subCategory.name}
                style={{
                  width: "100%",
                  height: "100%",
                  maxHeight: 200,
                  objectFit: "cover",
                  borderRadius: 8,
                }}
              />
            </div>

            {/* التايم لاين */}
            <div style={{ flex: 1 }}>
              <SubCategoriesTimeline
                subCategories={subCategory.name}
                category={subCategory.categories_name}
              />
            </div>
          </div>

          {/* أزرار التعديل والحذف */}
          <Group grow mt="sm">
            <Tooltip label="Edit" withArrow radius={5}>
              <ActionIcon
                variant="light"
                radius="xl"
                color="orange"
                size="xs"
                style={{
                  width: 30,
                  height: 30,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                onClick={() => onEdit(subCategory)}
              >
                <BorderColorIcon style={{ fontSize: 18 }} />
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
                onClick={() => onDelete(subCategory.id)}
              >
                <DeleteForeverIcon style={{ fontSize: 18 }} />
              </ActionIcon>
            </Tooltip>
          </Group>
        </Card>
      ))}
    </>
  );
}
