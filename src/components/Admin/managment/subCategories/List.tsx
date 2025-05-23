import React from "react";
import { Card, Image, Text,Badge, Group, ActionIcon, Tooltip } from "@mantine/core";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import BorderColorIcon from "@mui/icons-material/BorderColor";

export default function List({ subCategories, onEdit, onDelete }) {
  console.log("subCategories", subCategories);

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
            maxWidth: 260,
            height: 250,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          {subCategory.image && (
            <Card.Section style={{ height: 200, overflow: "hidden" }}>
              <div className="p-8">
                <Image
                  src={subCategory.image}
                  alt={subCategory.name}
                  height={150}
                  width="50%"
                  fit="cover"
                />
              </div>
            </Card.Section>
          )}
          <Group justify="space-between" mt="md" mb="xs">
            <Text fw={500}>{subCategory.name}</Text>
            <Badge color="pink"> {subCategory.categories_name}</Badge>
          </Group>
         

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
