import React from "react";
import { Card, Image, Text, Group, ActionIcon, Tooltip } from "@mantine/core";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import BorderColorIcon from "@mui/icons-material/BorderColor";

export default function List({ categories, onEdit, onDelete }) {
  return (
    <>
      {categories.map((category) => (
        <Card
          key={category.id}
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
          {category.image && (
            <Card.Section style={{ height: 200, overflow: "hidden" }}>
              <div className="p-8">
                <Image
                  src={category.image}
                  alt={category.name}
                  height={150}
                  width="50%"
                  fit="cover"
                />
              </div>
            </Card.Section>
          )}

          <Group justify="center" mt="sm" mb="xs">
            <Text fw={500} size="lg" ta="center">
              {category.name}
            </Text>
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
                onClick={() => onEdit(category)}
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
                onClick={() => onDelete(category.id)}
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
