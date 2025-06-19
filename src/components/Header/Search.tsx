"use client";

import { useState, useEffect } from "react";
import { useDisclosure, useDebouncedValue } from "@mantine/hooks";
import {
  Modal,
  Button,
  TextInput,
  Loader,
  Stack,
  Center,
  Group,
  Text,
  Badge,
  Box,
} from "@mantine/core";
import { ScrollArea } from "@mantine/core";

import { fetchAllProducts } from "./services/Products";
import { FaSearch } from "react-icons/fa";
import i18n from "@/app/lib/i18n";
import { t } from "i18next";
import Image from "next/image";
import { useDispatch } from "react-redux";
import { updateQuickView } from "@/redux/features/quickView-slice";
import { useModalContext } from "@/app/context/QuickViewModalContext";

export default function Search() {
  const [opened, { open, close }] = useDisclosure(false);
  const [query, setQuery] = useState("");
  const [debouncedQuery] = useDebouncedValue(query, 300);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const { openModal } = useModalContext();

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
      {/* Glassy Modal */}
      <Modal
        opened={opened}
        onClose={handelClose}
        title={t("search_products")}
        centered
        radius="md"
        dir={i18n.language === "ar" ? "rtl" : "ltr"}
        overlayProps={{
          backgroundOpacity: 0.2,
          blur: 6,
        }}
        styles={{
          content: {
            background: "rgba(255, 255, 255, 0.25)",
            backdropFilter: "blur(15px)",
            borderRadius: "1rem",
            border: "1px solid rgba(255, 255, 255, 0.3)",
            boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
          },
          header: {
            color: "#333",
            fontWeight: 600,
            fontSize: "1.1rem",
            background: "rgba(255, 255, 255, 0.7)",
          },
        }}
      >
        <ScrollArea h={400} type="never">
          <Stack dir="ltr">
            <TextInput
              autoFocus
              radius="md"
                variant="filled"
              placeholder={t("search_products")}
              value={query}
              onChange={(e) => setQuery(e.currentTarget.value)}
              dir="ltr"
               mt="md"
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
                  style={{
                    borderRadius: 8,
                    transition: "0.2s",
                  }}
                  className="hover:bg-white/80 bg-white/70 cursor-pointer"
                  dir="ltr"
                  onClick={() => {
                    dispatch(updateQuickView(product));
                    openModal();
                    handelClose();
                  }}
                >
                  <Group align="center">
                    {product.images[0] && (
                      <Image
                        src={product.images[0]}
                        width={50}
                        height={50}
                        alt="Product image"
                      />
                    )}

                    <Stack style={{ flex: 1 }}>
                      <Group>
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
        </ScrollArea>
      </Modal>

      {/* Search Button */}
      <div className="w-full flex justify-center">
        <Button
          variant="light"
          radius="lg"
          onClick={open}
          className={`flex items-center gap-2 px-3 py-2 transition-all backdrop-blur-md bg-white/30 border border-white/40 shadow-md hover:bg-white/50 ${
            i18n.language === "ar" ? "flex-row-reverse" : "flex-row"
          }`}
        >
          <FaSearch color="#000" size={14} />
          <span className="text-sm hidden sm:inline text-black whitespace-nowrap">
            {t("search_products")}
          </span>
        </Button>
      </div>
    </>
  );
}
