"use client";

import { useState } from "react";
import {
  Paper,
  Flex,
  Text,
  ActionIcon,
  Collapse,
  Checkbox,
  ScrollArea,
  Box,
} from "@mantine/core";
import { IoIosArrowUp } from "react-icons/io";
import { useTranslation } from "react-i18next";

const BrandDropdown = ({ brands, onBrandChange }) => {
  const { t, i18n } = useTranslation();
  const [toggleDropdown, setToggleDropdown] = useState(true);
  const [selectedBrands, setSelectedBrands] = useState([]);

  const handleChange = (values) => {
    setSelectedBrands(values);
    onBrandChange?.(values);
  };

  return (
    <Paper shadow="sm" radius="md" withBorder>
      {/* Header */}
      <Flex
        direction={i18n.language === "ar" ? "row-reverse" : "row"}
        align="center"
        justify="space-between"
        px="md"
        py="xs"
        mb="sm"
        onClick={() => setToggleDropdown(!toggleDropdown)}
        style={{
          cursor: "pointer",
          backgroundColor: "black",
          borderTopLeftRadius: "5px",
          borderTopRightRadius: "5px",
        }}
      >
        <Text c={"white"} fw={500}>
          {t("brands")}
        </Text>
        <ActionIcon
          variant="subtle"
          color="white"
          size="md"
          aria-label="Toggle brand dropdown"
          style={{
            transform: toggleDropdown ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 200ms ease",
          }}
        >
          <IoIosArrowUp size={20} />
        </ActionIcon>
      </Flex>

      {/* Dropdown content */}
      <Collapse in={toggleDropdown}>
        <Box px="md" pb="md">
          <ScrollArea
            style={{
              height: 200,
              backgroundColor: "white",
              padding: 12,
            }}
            offsetScrollbars
          >
            <Checkbox.Group value={selectedBrands} onChange={handleChange}>
              {brands.map((brand, idx) => (
                <Checkbox
                  key={idx}
                  value={brand.name}
                  label={
                    <Flex justify="space-between" align="center" w="100%">
                      <Text>{brand.name}</Text>
                      <Box
                        style={{
                          borderRadius: 9999,
                          padding: "0 10px",
                          fontSize: 12,
                          fontWeight: 500,
                          color: "#4a4a4a",
                          minWidth: 30,
                          textAlign: "center",
                        }}
                      >
                        {brand.products}
                      </Box>
                    </Flex>
                  }
                  styles={{
                    input: {
                      backgroundColor: selectedBrands.includes(brand.name)
                        ? "black"
                        : "white",
                      borderColor: selectedBrands.includes(brand.name)
                        ? "black"
                        : "#ced4da",
                    },
                    icon: {
                      color: selectedBrands.includes(brand.name)
                        ? "white"
                        : "black",
                    },
                    label: {
                      color: selectedBrands.includes(brand.name)
                        ? "black"
                        : "inherit",
                      fontWeight: selectedBrands.includes(brand.name)
                        ? 600
                        : 400,
                    },
                  }}
                  style={{ marginBottom: 8 }}
                />
              ))}
            </Checkbox.Group>
          </ScrollArea>
        </Box>
      </Collapse>
    </Paper>
  );
};

export default BrandDropdown;
