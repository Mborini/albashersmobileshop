import React from "react";
import { Card, Image, Text, Group, ActionIcon, Tooltip } from "@mantine/core";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import { FaPlusCircle } from "react-icons/fa";

export default function List({ subCategories, onEdit, onAdd }) {
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
            maxWidth: 300,
            height: 350,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          {subCategory.image && (
            <Card.Section style={{ height: 300, overflow: "hidden" }}>
              <div className="p-8">
                <Image
                  src={subCategory.image}
                  alt={subCategory.name}
                  height={300}
                  width="50%"
                  fit="cover"
                />
              </div>
            </Card.Section>
          )}

          <Group justify="center" mt="sm" mb="xs">
            <Text fw={500} size="lg" ta="center">
              {subCategory.name}
            </Text>
          </Group>
          <Group grow mt="sm">
            <Tooltip label="Add" withArrow radius={5}>
              <ActionIcon
                variant="light"
                radius="xl"
                color="blue"
                size="xs"
                style={{
                  width: 30,
                  height: 30,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                onClick={() => onAdd(subCategory)}
              >
                <FaPlusCircle style={{ fontSize: 18 }} />
              </ActionIcon>
            </Tooltip>
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
          </Group>
        </Card>
      ))}
    </>
  );
}
