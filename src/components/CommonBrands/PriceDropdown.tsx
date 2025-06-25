"use client";

import { useState } from "react";
import {
  Box,
  Text,
  Flex,
  Paper,
  ActionIcon,
  Collapse,
  RangeSlider,
  NumberInput,
} from "@mantine/core";
import { useTranslation } from "react-i18next";
import { IoIosArrowUp } from "react-icons/io";

const PriceDropdown = ({ onPriceChange }) => {
  const { t } = useTranslation();
  const [toggleDropdown, setToggleDropdown] = useState(true);

  const [selectedPrice, setSelectedPrice] = useState<[number, number]>([
    1, 2000,
  ]);

  const handlePriceChange = (values: [number, number]) => {
    const [min, max] = values;
    if (min > max) return;
    setSelectedPrice(values);
    onPriceChange({ min, max });
  };

  const handleMinChange = (value: number | "") => {
    if (value === "") return;
    const newMin = Math.min(value, selectedPrice[1]);
    handlePriceChange([newMin, selectedPrice[1]]);
  };

  const handleMaxChange = (value: number | "") => {
    if (value === "") return;
    const newMax = Math.max(value, selectedPrice[0]);
    handlePriceChange([selectedPrice[0], newMax]);
  };

  return (
    <Paper shadow="sm" radius="md" withBorder>
      {/* Header */}
      <Flex
        align="center"
        justify="space-between"
        px="md"
        py="sm"
        onClick={() => setToggleDropdown(!toggleDropdown)}
        style={{ cursor: "pointer" }}
      >
        <Text fw={500}>{t("price")}</Text>
        <ActionIcon
          variant="subtle"
          color="dark"
          size="md"
          aria-label="Toggle price dropdown"
          style={{
            transform: toggleDropdown ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 200ms ease",
          }}
        >
          <IoIosArrowUp size={20} />
        </ActionIcon>
      </Flex>

      <Collapse in={toggleDropdown}>
        <Box px="md" pb="md">
          {/* Slider */}
          <RangeSlider
            value={selectedPrice}
            onChange={handlePriceChange}
            min={1}
            max={1500}
            step={1}
            size="sm"
            color="blue"
            thumbSize={18}
          />

          {/* Min/Max Inputs */}
          <Flex justify="space-between" gap="sm" mt="md">
            <NumberInput
              label={t("min")}
              value={selectedPrice[0]}
              onChange={handleMinChange}
              min={1}
              max={selectedPrice[1]}
              step={1}
              radius="md"
              size="xs"
              hideControls={true}
              leftSection={
                <Text size="xs" c="dimmed" style={{ marginRight: 4 }}>
                  JOD:
                </Text>
              }
              leftSectionWidth={50}
              styles={{
                input: {
                  paddingLeft: 60,
                  fontSize: 13,
                },
                section: {
                  pointerEvents: "none",
                },
              }}
            />

            <NumberInput
              label={t("max")}
              value={selectedPrice[1]}
              onChange={handleMaxChange}
              min={selectedPrice[0]}
              max={1500}
              step={1}
               radius="md"
              size="xs"
              hideControls={true}
              leftSection={
                <Text size="xs" c="dimmed" style={{ marginRight: 4 }}>
                  JOD:
                </Text>
              }
              leftSectionWidth={50}
              styles={{
                input: {
                  paddingLeft: 60,
                  fontSize: 13,
                },
                section: {
                  pointerEvents: "none",
                },
              }}
            />
          </Flex>
        </Box>
      </Collapse>
    </Paper>
  );
};

export default PriceDropdown;
