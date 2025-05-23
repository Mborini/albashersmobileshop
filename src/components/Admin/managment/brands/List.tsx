import React from "react";
import { Card, Image, Text, Badge,Group, ActionIcon, Tooltip } from "@mantine/core";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import BorderColorIcon from "@mui/icons-material/BorderColor";


export default function List({ brand, onEdit, onDelete }) {
  return (
    <>
      {brand.map((brand) => (
        <Card
          key={brand.id}
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
          {brand.image && (
            <Card.Section style={{ height: 200, overflow: "hidden" }}>
              <div className="p-8">
                <Image
                  src={brand.image}
                  alt={brand.name}
                  height={150}
                  width="50%"
                  fit="cover"
                />
              </div>
            </Card.Section>
          )}

          <Group justify="space-around" mt="sm" mb="xs">
            <Text fw={500} size="lg" ta="center">
              {brand.name}
            </Text>
            {brand.isCommon}
            <Badge color={brand.isCommon ? "green" : "red"}>
              {brand.isCommon ? "Common" : "Not Common"}
            </Badge>
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
                onClick={() => onEdit(brand)}
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
                onClick={() => onDelete(brand.id)}
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
