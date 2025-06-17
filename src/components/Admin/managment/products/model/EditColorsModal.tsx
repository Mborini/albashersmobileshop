import React, { useState, useEffect } from "react";
import {
  Modal,
  Text,
  Stack,
  Group,
  ColorSwatch,
  Tooltip,
  Box,
  SimpleGrid,
} from "@mantine/core";
import axios from "axios";

export default function EditColorsModal({ opened, onClose, product }) {
  const [allColors, setAllColors] = useState([]);
  const [localProductColors, setLocalProductColors] = useState([]);
  const [loadingColorId, setLoadingColorId] = useState(null);

  useEffect(() => {
    if (opened) {
      axios.get("/api/colors").then((res) => {
        setAllColors(res.data || []);
      });

      setLocalProductColors(product.product_colors || []);
    }
  }, [opened, product]);

  const handleRemoveColor = async (colorId) => {
    setLoadingColorId(colorId);
    try {
      await axios.delete("/api/Admin/product-colors", {
        data: {
          product_id: product.product_id,
          color_id: colorId,
        },
      });

      setLocalProductColors((prev) =>
        prev.filter((color) => color.id !== colorId)
      );
    } catch (error) {
      console.error("failed to remove color:", error);
    } finally {
      setLoadingColorId(null);
    }
  };

  const handleAddColor = async (colorId) => {
    setLoadingColorId(colorId);
    try {
      await axios.post("/api/Admin/product-colors", {
        product_id: product.product_id,
        color_id: colorId,
      });

      const addedColor = allColors.find((c) => c.id === colorId);
      if (addedColor) {
        setLocalProductColors((prev) => [...prev, addedColor]);
      }
    } catch (error) {
      console.error("failed to add color:", error);
    } finally {
      setLoadingColorId(null);
    }
  };

  if (!product) return null;

  const orderedProductColors = allColors.filter((color) =>
    localProductColors.some((pc) => pc.id === color.id)
  );

  const addableColors = allColors.filter(
    (color) => !localProductColors.some((pc) => pc.id === color.id)
  );

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Colors Manager"
      size="xl"
      centered
      overlayProps={{
        backgroundOpacity: 0.55,
        blur: 3,
      }}
    >
      <Group align="flex-start" grow spacing="xl">
        <Stack spacing="md" w="50%">
          <Text size="lg" fw={700}>
            Current Colors
          </Text>
          <Group spacing="xs" wrap="wrap">
            {orderedProductColors.length > 0 ? (
              orderedProductColors.map((color) => (
                <Tooltip key={color.id} label={`Delete ${color.name}`} withArrow>
                  <Box
                    onClick={() => handleRemoveColor(color.id)}
                    style={{ cursor: "pointer", position: "relative" }}
                  >
                    <ColorSwatch
                      color={color.hex_code}
                      size={36}
                      style={{
                        opacity: loadingColorId === color.id ? 0.5 : 1,
                        outline:
                          loadingColorId === color.id
                            ? "2px solid red"
                            : "1px solid #ccc",
                      }}
                    />
                  </Box>
                </Tooltip>
              ))
            ) : (
              <Text color="dimmed">No colors added yet.</Text>
            )}
          </Group>
        </Stack>

        <Stack spacing="md" w="50%">
          <Text size="lg" fw={700}>
            Add Colors
          </Text>
          <SimpleGrid cols={7} spacing="xs">
            {addableColors.map((color) => (
              <Tooltip key={color.id} label={color.name} withArrow>
                <Box
                  style={{ cursor: "pointer", position: "relative" }}
                  onClick={() => handleAddColor(color.id)}
                >
                  <ColorSwatch
                    color={color.hex_code}
                    size={36}
                    radius="xl"
                    style={{
                      outline:
                        loadingColorId === color.id ? "2px solid #007bff" : "none",
                      opacity: loadingColorId === color.id ? 0.5 : 1,
                    }}
                  />
                </Box>
              </Tooltip>
            ))}
          </SimpleGrid>
        </Stack>
      </Group>
    </Modal>
  );
}
