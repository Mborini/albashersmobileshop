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
import {
  FaFacebook,
  FaInstagram,
  FaWhatsapp,
  FaPhone,
  FaTools,
  FaClock,
  FaCalendarAlt,
  FaEnvelope,
  FaShareAlt,
} from "react-icons/fa";
import { IconType } from "react-icons";
import { BiSticker, BiSolidCategory } from "react-icons/bi";
import { FiArrowLeftCircle } from "react-icons/fi";
import { TiHome } from "react-icons/ti";

// ===== بيانات الفروع =====
const branches = [
  {
    nameKey: "Basheer_Shop_Opposite_Oppo",
    nameAr: "فرع بشير شوب مقابل أوبو",
    international: "+962796855578",
    display: "079 685 5578",
  },
  {
    nameKey: "Basheer_3",
    nameAr: "فرع بشير 3",
    international: "+962796161536",
    display: "079 616 1536",
  },
  {
    nameKey: "Basheer_1_University_Circle",
    nameAr: "فرع بشير 1 دوار الجامعة",
    international: "+962790459191",
    display: "079 045 9191",
  },
];

const MAIN_BRANCH = branches[0];
const EMAIL = "albasheermbl@gmail.com";

const whatsappUrl = (international: string) =>
  `https://wa.me/${international.replace("+", "")}`;

interface Option {
  label: string;
  type: "brand" | "category" | "subcategory" | "root" | "info" | "back" | "main";
  id?: number;
  icon?: IconType;
}

type MessageKind = "text" | "phones" | "social" | "whatsapp";

interface Message {
  sender: "user" | "bot";
  text: string;
  kind?: MessageKind;
}

const defaultOptions: Option[] = [
  { label: "العلامات التجارية", type: "root", icon: BiSticker },
  { label: "الأقسام", type: "root", icon: BiSolidCategory },
  { label: "الصيانة", type: "info", icon: FaTools },
  { label: "مواعيد العمل", type: "info", icon: FaClock },
  { label: "أيام العمل", type: "info", icon: FaCalendarAlt },
  { label: "أرقام التواصل", type: "info", icon: FaPhone },
  { label: "السوشيال ميديا", type: "info", icon: FaShareAlt },
  { label: "واتساب", type: "info", icon: FaWhatsapp },
  { label: "الإيميل", type: "info", icon: FaEnvelope },
];

const navButtons: Option[] = [
  { label: "رجوع", type: "back", icon: FiArrowLeftCircle },
  { label: "القائمة الرئيسية", type: "main", icon: TiHome },
];

export default function ChatPopup() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "bot",
      text: "مرحباً بك في Albasheer Shop! اختر من الخيارات التالية:",
    },
  ]);

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

  const fetchList = async (
    url: string,
    type: Option["type"]
  ): Promise<Option[]> => {
    const res = await fetch(url);
    const data = await res.json();
    return data.map((item: any) => ({
      label: item.name,
      type,
      id: item.id,
    }));
  };

  const fetchBrands = () => fetchList("/api/commonBrands", "brand");
  const fetchCategories = () => fetchList("/api/categories", "category");
  const fetchSubcategories = (categoryId: number) =>
    fetchList(`/api/categories/${categoryId}`, "subcategory");

  const botSay = (text: string, kind: MessageKind = "text") =>
    setMessages((prev) => [...prev, { sender: "bot", text, kind }]);

  const handleClick = async (option: Option) => {
    setMessages((prev) => [...prev, { sender: "user", text: option.label }]);

    // نحفظ الخيارات الحالية للرجوع فقط عندما تتغير القائمة فعلاً
    if (
      option.type !== "back" &&
      option.type !== "main" &&
      option.type !== "info"
    ) {
      setHistory((prev) => [...prev, options]);
    }

    if (option.type === "root") {
      if (option.label === "العلامات التجارية") {
        const brands = await fetchBrands();
        botSay("اختر العلامة التجارية:");
        setOptions([...navButtons, ...brands]);
      } else if (option.label === "الأقسام") {
        const categories = await fetchCategories();
        botSay("اختر القسم:");
        setOptions([...navButtons, ...categories]);
      }
    } else if (option.type === "category" && option.id) {
      const subs = await fetchSubcategories(option.id);
      botSay("اختر الفئة الفرعية:");
      setOptions([...navButtons, ...subs]);
    } else if (option.type === "subcategory" && option.id) {
      router.push(`/products?subCategoryId=${option.id}`);
      setOpen(false);
    } else if (option.type === "brand" && option.id) {
      router.push(`/ProductsBrands/${option.id}`);
      setOpen(false);
    } else if (option.type === "info") {
      switch (option.label) {
        case "الصيانة":
          botSay(
            `لخدمة الصيانة يمكنك الاتصال بنا على الرقم ${MAIN_BRANCH.display}`
          );
          break;
        case "مواعيد العمل":
          botSay("مواعيد العمل من الساعة 10 صباحاً حتى 12 مساءً.");
          break;
        case "أيام العمل":
          botSay(
            "نعمل طوال أيام الأسبوع من الساعة 10 صباحاً حتى 12 مساءً، عدا الجمعة من الساعة 4 مساءً حتى 12 مساءً."
          );
          break;
        case "أرقام التواصل":
          botSay("أرقام التواصل:", "phones");
          break;
        case "السوشيال ميديا":
          botSay("تابعنا على:", "social");
          break;
        case "واتساب":
          botSay("تحدث معنا على واتساب", "whatsapp");
          break;
        case "الإيميل":
          botSay(`راسلنا على: ${EMAIL}`);
          break;
        default:
          botSay("عذراً، لا توجد معلومات حالياً.");
      }
    } else if (option.type === "back") {
      const prev = history[history.length - 1];
      if (prev) {
        setOptions(prev);
        setHistory(history.slice(0, -1));
      }
    } else if (option.type === "main") {
      setOptions(defaultOptions);
      setHistory([]);
    }
  };

  const renderMessage = (msg: Message) => {
    switch (msg.kind) {
      case "phones":
        return (
          <>
            {msg.text}
            <Stack gap={8} mt={8}>
              {branches.map((b) => (
                <div key={b.nameKey}>
                  <Text size="xs" c="dimmed" component="div">
                    {b.nameAr}
                  </Text>
                  <div
                    dir="ltr"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                    }}
                  >
                    <a
                      href={`tel:${b.international}`}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        color: "#111",
                        textDecoration: "none",
                        fontWeight: 500,
                      }}
                    >
                      <FaPhone size={12} />
                      {b.display}
                    </a>
                    <a
                      href={whatsappUrl(b.international)}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`WhatsApp ${b.display}`}
                      style={{ color: "#25D366", display: "flex" }}
                    >
                      <FaWhatsapp size={18} />
                    </a>
                  </div>
                </div>
              ))}
            </Stack>
          </>
        );

      case "social":
        return (
          <>
            {msg.text}
            <div dir="ltr" style={{ marginTop: 8 }}>
              <a
                href="https://facebook.com/AlbasherShop"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: "#1877F2",
                  textDecoration: "none",
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                  marginTop: 8,
                }}
              >
                <FaFacebook />
                AlbasherShop
              </a>
              <a
                href="https://www.instagram.com/albasher.jo"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: "#E4405F",
                  textDecoration: "none",
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                  marginTop: 4,
                }}
              >
                <FaInstagram />
                albasher.jo
              </a>
            </div>
          </>
        );

      case "whatsapp":
        return (
          <a
            href={whatsappUrl(MAIN_BRANCH.international)}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: "#25D366",
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <FaWhatsapp /> {msg.text}، اضغط هنا
          </a>
        );

      default:
        return msg.text;
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label="فتح المساعد"
        style={{
          position: "fixed",
          bottom: 80,
          left: 20,
          zIndex: 10,
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
          <ScrollArea
            h={isMobile ? 300 : 350}
            offsetScrollbars
            scrollbarSize={0}
          >
            <Stack>
              {messages.map((msg, i) => (
                <div
                  key={i}
                  ref={i === messages.length - 1 ? lastMessageRef : null}
                >
                  <Paper
                    p="xs"
                    radius="md"
                    bg={msg.sender === "user" ? "gray.1" : "blue.1"}
                    maw="80%"
                    ml={msg.sender === "user" ? "auto" : undefined}
                    mr={msg.sender === "bot" ? "auto" : undefined}
                  >
                    <Text
                      size="sm"
                      dir="rtl"
                      component="div"
                      style={{ whiteSpace: "pre-line" }}
                    >
                      {renderMessage(msg)}
                    </Text>
                  </Paper>
                </div>
              ))}
            </Stack>
          </ScrollArea>

          <Divider label="الخيارات" labelPosition="center" />

          <ScrollArea
            h={isMobile ? 200 : 250}
            offsetScrollbars
            scrollbarSize={0}
          >
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
                      className="cursor-pointer hover:bg-gray-100 text-center transition"
                    >
                      <Text
                        size="xs"
                        component="div"
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          gap: 4,
                        }}
                      >
                        {opt.icon && <opt.icon size={18} />}
                        {opt.label}
                      </Text>
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
                      color={opt.type === "back" ? "red" : "green"}
                      size="xs"
                      leftSection={opt.icon ? <opt.icon size={16} /> : null}
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
