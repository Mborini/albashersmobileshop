"use client";

import { motion, AnimatePresence, hover } from "framer-motion";
import { useState, useEffect } from "react";
import { useDisclosure, useDebouncedValue } from "@mantine/hooks";
import {
  Modal,
  Button,
  TextInput,
  Center,
  Group,
  Text,
  Badge,
  Box,
  Stack,
  ScrollArea,
} from "@mantine/core";

import { fetchAllProducts } from "./services/Products";
import { FaSearch } from "react-icons/fa";
import i18n from "@/app/lib/i18n";
import { t } from "i18next";
import Image from "next/image";
import { useDispatch } from "react-redux";
import { updateQuickView } from "@/redux/features/quickView-slice";
import { useModalContext } from "@/app/context/QuickViewModalContext";
import { LuLoader } from "react-icons/lu";

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
      if (!debouncedQuery.trim()) {
        setResults([]);
        setLoading(false);
        return;
      }

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
        overlayProps={{
          backgroundOpacity: 0.2,
          blur: 6,
        }}
        styles={{
          content: {
            background: "rgba(255, 255, 255, 0.50)",
            backdropFilter: "blur(15px)",
            borderRadius: "1rem",
            border: "1px solid rgba(255, 255, 255, 0.3)",
            boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
          },
          header: {
            color: "white",
            fontWeight: 600,
            fontSize: "1.1rem",
            background: "black",
          },
        }}
      >
        <ScrollArea h={400} type="never" scrollbarSize={0} offsetScrollbars>
          <Stack dir="ltr" style={{ overflow: "hidden" }}>
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
                <LuLoader
                  size={24}
                  className="text-black  mt- 12 custom-spin"
                />
              </Center>
            ) : (
              <ScrollArea
                h={400}
                type="never"
                scrollbarSize={0}
                offsetScrollbars
              >
                <Stack dir="ltr" style={{ overflow: "hidden" }}>
                  <motion.div
                    variants={{
                      hidden: {},
                      show: {
                        transition: {
                          staggerChildren: 0.08,
                        },
                      },
                    }}
                    initial="hidden"
                    animate="show"
                    exit="hidden"
                  >
                    <AnimatePresence>
                      {results.map((product: any) => (
                        <motion.div
                          key={product.id}
                          variants={{
                            hidden: { opacity: 0, y: 10, scale: 0.98 },
                            show: { opacity: 1, y: 0, scale: 1 },
                          }}
                          exit={{ opacity: 0, y: 10, scale: 0.98 }}
                          transition={{ duration: 0.3, ease: "easeOut" }}
                        >
                          <Box
                            p="xs"
                            mb="xs"
                            style={{
                              borderRadius: 8,
                              transition: "0.2s",
                              backgroundColor: "rgba(255, 255, 255, 0.5)",
                            }}
                            className="cursor-pointer hover:bg-gray-2"
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
                                  <Text
                                    c="dimmed"
                                    className=" group-hover:text-black transition-colors duration-200"
                                    fw={500}
                                    size="sm"
                                  >
                                    {product.title}
                                  </Text>
                                  <Badge
                                    size="xs"
                                    variant="gradient"
                                    gradient={{
                                      from: "green",
                                      to: "lime",
                                      deg: 360,
                                    }}
                                  >
                                    {product.brand_name}
                                  </Badge>
                                </Group>

                                <Text
                                  size="xs"
                                  c="dimmed"
                                  className=" group-hover:text-black transition-colors duration-200"
                                >
                                  {product.category_name} /{" "}
                                  {product.subcategory_name}
                                </Text>
                              </Stack>
                            </Group>
                          </Box>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </motion.div>
                </Stack>
              </ScrollArea>
            )}
          </Stack>
        </ScrollArea>
      </Modal>

      <div
        dir={i18n.language === "ar" ? "rtl" : "ltr"}
        className="w-full flex justify-center"
      >
        <button
          onClick={open}
          className="p-0 m-0 bg-transparent border-none shadow-none hover:bg-transparent"
        >
          <div className="flex items-center gap-1">
            <FaSearch color="#000" size={14} />
            <span className="text-sm text-black hidden sm:inline">
              {t("search_products")}
            </span>
          </div>
        </button>
      </div>
    </>
  );
}
