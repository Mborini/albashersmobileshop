"use client";

import { useState, useEffect } from "react";
import { useDisclosure, useDebouncedValue } from "@mantine/hooks";
import { Modal, Button, TextInput, Loader, Stack, Center, Group, Text, Badge, Box } from "@mantine/core";
import { fetchAllProducts } from "./services/Products";
import { FaSearch } from "react-icons/fa";
import i18n from "@/app/lib/i18n";
import { t } from "i18next";
import Image from "next/image";

export default function Search() {
  const [opened, { open, close }] = useDisclosure(false);
  const [query, setQuery] = useState("");
  const [debouncedQuery] = useDebouncedValue(query, 300);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchResults = async () => {
      if (!debouncedQuery.trim()) return setResults([]);

      setLoading(true);
      try {
        const products = await fetchAllProducts(debouncedQuery);
        setResults(products);
      } catch (err) {
        console.error("Error fetching:", err);
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [debouncedQuery]);
  const handelClose = () => {
    setQuery("");
    close();
  };
  return (
    <>
      <Modal
        opened={opened}
        onClose={handelClose}
        title={t("search_products")}
        centered
        radius="md"
        dir={i18n.language === "ar" ? "rtl" : "ltr"}
      >
        <Stack dir="ltr" >
          <TextInput
            autoFocus
            radius={"md"}
            variant="filled"
            placeholder="Search for a product..."
            value={query}
            onChange={(e) => setQuery(e.currentTarget.value)}
            dir="ltr"
          />

{loading ? (
  <Center>
    <Loader size="sm" />
  </Center>
) : (

  results.map((product: any) => (
    <Box
      key={product.id}
      p="xs"
      style={{ borderRadius: 8, transition: "0.2s" }}
      className="hover:bg-blue-light-5 cursor-pointer"
      dir={"ltr"}
      
    >
      <Group align="center" spacing="md" noWrap>
        <Image
          src={product.image_url}
          alt={product.title}
          width={50}
          height={50}
          radius="md"
          fit="cover"
        />
        <Stack spacing={2} style={{ flex: 1 }}>
          <Group position="apart" spacing="xs">
            <Text fw={500} size="sm">
              {product.title}
            </Text>
            <Badge color="blue" variant="light" size="xs">
              {product.brand_name}
            </Badge>
          </Group>
  
          <Text size="xs" c="dimmed">
            {product.category_name} / {product.subcategory_name}
          </Text>
        </Stack>
      </Group>
    </Box>
  ))
  
)}

        </Stack>
      </Modal>

      <Button variant="outline" radius={"lg"} onClick={open}>
        <span
          className="flex items-center gap-2"
          dir={i18n.language === "ar" ? "rtl" : "ltr"}
        >
          <FaSearch size={16} />
          
          {t("search_products")}
        </span>
      </Button>
    </>
  );
}
