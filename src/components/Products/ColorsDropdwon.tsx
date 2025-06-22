"use client";

import React, { useState } from "react";
import {
  Paper,
  Flex,
  Text,
  ActionIcon,
  Collapse,
  Tooltip,
  Box,
  Group,
} from "@mantine/core";
import { IoIosArrowUp } from "react-icons/io";
import { useTranslation } from "react-i18next";
const ColorsDropdown = ({ colors, onColorChange }) => {
  const [toggleDropdown, setToggleDropdown] = useState(true);
  const [activeColor, setActiveColor] = useState<string | null>(null);
  const { t } = useTranslation();
  
  const handleColorChange = (color: string | null) => {
    setActiveColor(color);
    onColorChange(color);
  };

  return (
    <Paper shadow="sm" radius="md" withBorder>
      {/* Header */}
      <Flex
        align="center"
        justify="space-between"
        px="md"
        py="sm"
        onClick={() => setToggleDropdown((prev) => !prev)}
        style={{ cursor: "pointer" }}
      >
        <Text fw={500}>
          {t("colors")}
        </Text>
        <ActionIcon
          variant="subtle"
          color="dark"
          size="xs"
          aria-label="Toggle color dropdown"
          style={{
            transform: toggleDropdown ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 200ms ease",
          }}
        >
          <IoIosArrowUp size={20} />
        </ActionIcon>
      </Flex>

      {/* Color Circles */}
      <Collapse in={toggleDropdown}>
        <Box px="md" py="sm">
          <Group gap="xs" wrap="wrap">
            {/* All option inside a circle */}
            <Tooltip label="All" withArrow>
              <Box
                onClick={() => handleColorChange(null)}
                w={20}
                h={20}
                style={{
                  borderRadius: "50%",
                  backgroundColor: "#eee",
                  border:
                    activeColor === null
                      ? "2px solid #228be6"
                      : "1px solid #ccc",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "0.6rem",
                  color: "#333",
                  fontWeight: 400,
                }}
              >
               {t("all")}
              </Box>
            </Tooltip>

            {/* Color Circles */}
            {colors.map((colorObj, index) => (
              <Tooltip key={index} label={colorObj.name || colorObj.hex_code} withArrow>
                <Box
                  onClick={() => handleColorChange(colorObj.hex_code)}
                  w={20}
                  h={20}
                  style={{
                    borderRadius: "50%",
                    backgroundColor: colorObj.hex_code,
                    border:
                      activeColor === colorObj.hex_code
                        ? "2px solid #228be6"
                        : "1px solid #ccc",
                    cursor: "pointer",
                  }}
                />
              </Tooltip>
            ))}
          </Group>
        </Box>
      </Collapse>
    </Paper>
  );
};

export default ColorsDropdown;
