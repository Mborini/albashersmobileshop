"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Drawer,
  ScrollArea,
  Paper,
  Text,
  Stack,
  Divider,
  Button,
  Grid,
} from "@mantine/core";
import { useRouter } from "next/navigation";
import { BsRobot } from "react-icons/bs";
import { useMediaQuery } from "@mantine/hooks";
import { FaFacebook, FaInstagram, FaWhatsapp } from "react-icons/fa";

interface Option {
  label: string;
  type: "brand" | "category" | "subcategory" | "root" | "info" | "back" | "main";
  id?: number;
}

interface Message {
  sender: "user" | "bot";
  text: string;
}

export default function ChatPopup() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "bot",
      text: "مرحباً بك في Albasheer Shop! اختر من الخيارات التالية:",
    },
  ]);

  const defaultOptions: Option[] = [
    { label: "🏷️ البراندات", type: "root" },
    { label: "📂 الأقسام", type: "root" },
    { label: "🛠️ الصيانة", type: "info" },
    { label: "🕐 مواعيد العمل", type: "info" },
    { label: "📅 أيام العمل", type: "info" },
    { label: "📞 أرقام التواصل", type: "info" },
    { label: "🌐 السوشيال ميديا", type: "info" },
    { label: "💬 واتساب", type: "info" },
    { label: "✉️ الإيميل", type: "info" },
  ];

  const [options, setOptions] = useState<Option[]>(defaultOptions);
  const [history, setHistory] = useState<Option[][]>([]);

  const lastMessageRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();
  const isMobile = useMediaQuery("(max-width: 768px)");

  useEffect(() => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const fetchBrands = async (): Promise<Option[]> => {
    const res = await fetch("/api/commonBrands");
    const data = await res.json();
    return data.map((item: any) => ({
      label: item.name,
      type: "brand",
      id: item.id,
    }));
  };

  const fetchCategories = async (): Promise<Option[]> => {
    const res = await fetch("/api/categories");
    const data = await res.json();
    return data.map((item: any) => ({
      label: item.name,
      type: "category",
      id: item.id,
    }));
  };

  const fetchSubcategories = async (categoryId: number): Promise<Option[]> => {
    const res = await fetch(`/api/categories/${categoryId}`);
    const data = await res.json();
    return data.map((item: any) => ({
      label: item.name,
      type: "subcategory",
      id: item.id,
    }));
  };

  const handleClick = async (option: Option) => {
    setMessages((prev) => [...prev, { sender: "user", text: option.label }]);

    if (option.type !== "back" && option.type !== "main") {
      setHistory((prev) => [...prev, options]);
    }

    if (option.type === "root") {
      if (option.label === "🏷️ البراندات") {
        const brands = await fetchBrands();
        setMessages((prev) => [
          ...prev,
          { sender: "bot", text: "اختر البراند:" },
        ]);
        setOptions([{ label: "🔙 رجوع", type: "back" }, { label: "🏠 القائمة الرئيسية", type: "main" }, ...brands]);
      } else if (option.label === "📂 الأقسام") {
        const categories = await fetchCategories();
        setMessages((prev) => [
          ...prev,
          { sender: "bot", text: "اختر القسم:" },
        ]);
        setOptions([{ label: "🔙 رجوع", type: "back" }, { label: "🏠 القائمة الرئيسية", type: "main" }, ...categories]);
      }
    } else if (option.type === "category" && option.id) {
      const subs = await fetchSubcategories(option.id);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "اختر الفئة الفرعية:" },
      ]);
      setOptions([{ label: "🔙 رجوع", type: "back" }, { label: "🏠 القائمة الرئيسية", type: "main" }, ...subs]);
    } else if (option.type === "subcategory" && option.id) {
      router.push(`/products?subCategoryId=${option.id}`);
      setOpen(false);
    } else if (option.type === "brand" && option.id) {
      router.push(`/ProductsBrands/${option.id}`);
      setOpen(false);
    } else if (option.type === "info") {
      let response = "";
      switch (option.label) {
        case "🛠️ الصيانة":
          response = "لخدمة الصيانة يرجى الاتصال على الرقم: 0786650900.";
          break;
        case "🕐 مواعيد العمل":
          response = "مواعيد العمل من الساعة 10 صباحاً حتى 12 مساءً.";
          break;
        case "📅 أيام العمل":
          response = "نعمل طوال أيام الأسبوع ما عدا الجمعة من الساعة 4 مساءً حتى الساعة 12 مساءً.";
          break;
        case "📞 أرقام التواصل":
          response = "للتواصل: 0796855578 ";
          break;
        case "🌐 السوشيال ميديا":
          response = "تابعنا على:";
          break;
        case "💬 واتساب":
          response = "whatsapp"; // سيتم التعامل معها بشكل خاص
          break;
        case "✉️ الإيميل":
          response = "راسلنا على: albasheermbl@gmail.com";
          break;
        default:
          response = "عذراً، لا توجد معلومات حالياً.";
      }
      setMessages((prev) => [...prev, { sender: "bot", text: response }]);
    } else if (option.type === "back") {
      const prev = history.pop();
      if (prev) {
        setOptions(prev);
        setHistory([...history]);
      }
    } else if (option.type === "main") {
      setOptions(defaultOptions);
      setHistory([]);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        style={{
          position: "fixed",
          bottom: 80,
          left: 20,
          zIndex: 999,
          width: 50,
          height: 50,
          borderRadius: "50%",
          backgroundColor: "black",
          border: "1px solid #ddd",
          boxShadow: "0 0 8px rgba(0,0,0,0.1)",
          padding: 0,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <BsRobot size={30} color="white" />
      </button>

      <Drawer
        opened={open}
        onClose={() => setOpen(false)}
        position="right"
        size={isMobile ? "100%" : "sm"}
        padding="md"
      >
        <Stack h="100%">
          <ScrollArea h={isMobile ? 300 : 350} offsetScrollbars scrollbarSize={0} styles={{ viewport: { paddingRight: 8 } }}>
            <Stack>
              {messages.map((msg, i) => (
                <div key={i} ref={i === messages.length - 1 ? lastMessageRef : null}>
                  <Paper
                    p="xs"
                    radius="md"
                    bg={msg.sender === "user" ? "gray.1" : "blue.1"}
                    maw="80%"
                    ml={msg.sender === "user" ? "auto" : undefined}
                    mr={msg.sender === "bot" ? "auto" : undefined}
                  >
                    <Text size="sm" dir="rtl" style={{ whiteSpace: "pre-line" }}>
                      {msg.text === "تابعنا على:" ? (
                        <>
                          تابعنا على:
                          <span dir="ltr" style={{ marginTop: 8 }}>
                            <a
                            href="https://facebook.com/AlbasherShop"
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ color: "#1877F2", textDecoration: "none", display: "block", marginTop: 8 }}
                          >
                            <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                              <FaFacebook />
                              AlbasherShop
                            </span>
                          </a>
                          <a
                            href="https://www.instagram.com/albasher.jo"
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ color: "#E4405F", textDecoration: "none", display: "block", marginTop: 4 }}
                          >
                            <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                              <FaInstagram />
                              albasher.jo
                            </span>
                          </a>
                          </span>
                        </>
                      ) : msg.text === "whatsapp" ? (
                        <a
                          href="https://wa.me/962796855578"
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ color: "#25D366", textDecoration: "none", display: "flex", alignItems: "center", gap: 6 }}
                        >
                          <FaWhatsapp /> تحدث معنا على واتساب ,اضغط هنا
                        </a>
                      ) : (
                        msg.text
                      )}
                    </Text>
                  </Paper>
                </div>
              ))}
            </Stack>
          </ScrollArea>

          <Divider label="الخيارات" labelPosition="center" />

          <ScrollArea h={isMobile ? 200 : 250} offsetScrollbars scrollbarSize={0} styles={{ viewport: { paddingRight: 8 } }}>
            <Grid gutter="xs">
              {options
                .filter((opt) => opt.type !== "back" && opt.type !== "main")
                .map((opt, i) => (
                  <Grid.Col span={4} key={i}>
                    <Paper
                      onClick={() => handleClick(opt)}
                      withBorder
                      p="xs"
                      shadow="xs"
                      radius="md"
                      className="cursor-pointer hover:bg-gray-100 transition"
                    >
                      <Text size="xs">{opt.label}</Text>
                    </Paper>
                  </Grid.Col>
                ))}
            </Grid>
          </ScrollArea>

          <Stack mt="auto">
            <Divider />
            <Grid gutter="xs">
              {options
                .filter((opt) => opt.type === "back" || opt.type === "main")
                .map((opt, i) => (
                  <Grid.Col span={6} key={i}>
                    <Button
                      onClick={() => handleClick(opt)}
                      fullWidth
                      variant="light"
                      color={opt.type === "back" ? "gray" : "green"}
                      size="xs"
                    >
                      {opt.label}
                    </Button>
                  </Grid.Col>
                ))}
            </Grid>
          </Stack>
        </Stack>
      </Drawer>
    </>
  );
}
