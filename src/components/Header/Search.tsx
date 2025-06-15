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
      <Modal
        opened={opened}
        onClose={handelClose}
        title={t("search_products")}
        centered
        radius="md"
        dir={i18n.language === "ar" ? "rtl" : "ltr"}
      >
        <ScrollArea h={400} type="never">
          {" "}
          {/* تمنع ظهور السكور بار */}
          <Stack dir="ltr">
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
                  onClick={() => {
                    dispatch(updateQuickView(product)); // استخدم اسم الأكشن الصحيح
                    openModal(); // افتح مودال التفاصيل
                    handelClose(); // سكّر مودال البحث
                  }}
                >
                  <Group align="center" >
                    {product.images[0] && (
                      <Image
                        src={product.images[0]}
                        width={50}
                        height={50}
                        alt="Product image"
                      />
                    )}

                    <Stack  style={{ flex: 1 }}>
                      <Group >
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

      <Button
        variant="outline"
        radius="lg"
        onClick={open}
        className={`flex items-center gap-2 px-3 ${
          i18n.language === "ar" ? "flex-row-reverse" : "flex-row"
        }`}
      >
        <div className="flex items-center gap-2">
          <FaSearch size={14} />
          <span className="text-sm hidden sm:inline whitespace-nowrap">
            {t("search_products")}
          </span>
        </div>
      </Button>
    </>
  );
}
