"use client";

import { useState, useRef, useEffect } from "react";
import {
  Drawer,
  ScrollArea,
  Paper,
  Text,
  Group,
  Stack,
  Divider,
} from "@mantine/core";
import Image from "next/image";

type Message = { sender: "user" | "bot"; text: string };
type Option = { label: string; next?: Option[]; reply?: string };

// ✅ خيارات المحادثة المحسّنة
const options: Option[] = [
  {
    label: "📱 المنتجات",
    next: [
      { label: "iPhone", reply: "تتوفر أجهزة iPhone بعدة موديلات وألوان." },
      { label: "iPad", reply: "تتوفر أجهزة iPad لجميع الاستخدامات." },
      { label: "Smart Watch", reply: "متوفر ساعات ذكية بجميع الأحجام." },
    ],
  },
  {
    label: "🎧 الإكسسوارات",
    next: [
      {
        label: "كفرات",
        reply: "نوفر مجموعة متنوعة من الكفرات الأصلية والمميزة.",
      },
      { label: "شواحن", reply: "نوفر شواحن أصلية وسريعة." },
      { label: "سماعات", reply: "تتوفر سماعات بجودة عالية منها AirPods." },
    ],
  },
  {
    label: "🏷️ البراندات",
    next: [
      { label: "Apple", reply: "منتجات Apple الأصلية متوفرة." },
      { label: "Anker", reply: "نوفر مجموعة مختارة من منتجات Anker." },
      { label: "Joyroom", reply: "Joyroom متوفر للإكسسوارات والشواحن." },
    ],
  },
  {
    label: "🛠️ الصيانة",
    next: [
      {
        label: "تغيير شاشة",
        reply: "نقوم بتبديل الشاشات الأصلية بجودة عالية.",
      },
      { label: "تغيير بطارية", reply: "نستخدم بطاريات أصلية ومضمونة." },
      { label: "مشاكل في الشبكة", reply: "نقدم خدمة فحص الشبكة مجاناً." },
    ],
  },
  {
    label: "✅ الكفالات",
    reply:
      "جميع الأجهزة مكفولة لمدة سنة من تاريخ الشراء، وتشمل الكفالة العيوب المصنعية فقط.",
  },
  {
    label: "🕓 مواعيد العمل",
    reply: "دوامنا من السبت إلى الخميس، من الساعة 10 صباحاً حتى 11 مساءً.",
  },
  {
    label: "📞 أرقام التواصل",
    next: [
      { label: "رقم المحل", reply: "رقم الهاتف: 06xxxxxxx" },
      { label: "رقم الصيانة", reply: "رقم الصيانة: 079xxxxxxx" },
      { label: "واتساب", reply: "راسلنا عبر واتساب: 079xxxxxxx" },
    ],
  },
  {
    label: "ℹ️ معلومات إضافية",
    next: [
      {
        label: "هل الأجهزة مكفولة؟",
        reply: "نعم، جميع الأجهزة مكفولة لمدة سنة.",
      },
      { label: "هل يوجد تقسيط؟", reply: "نعم، يوجد تقسيط عبر شركات معتمدة." },
    ],
  },
];

export default function ChatPopup() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { sender: "bot", text: "مرحباً بك في Albasheer Shop!:" },
  ]);
  const [currentOptions, setCurrentOptions] = useState<Option[]>(options);
  const lastMessageRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleClick = (option: Option) => {
    setMessages((prev) => [...prev, { sender: "user", text: option.label }]);

    if (option.reply) {
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          { sender: "bot", text: option.reply! },
        ]);
      }, 400);
    }

    if (option.next) {
      setTimeout(() => {
        setMessages((prev) => [...prev, { sender: "bot", text: "اختر :" }]);
        setCurrentOptions(option.next!);
      }, 500);
    } else {
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          { sender: "bot", text: "هل ترغب في العودة للقائمة الرئيسية؟" },
        ]);
        setCurrentOptions(options);
      }, 2000);
    }
  };

  return (
    <>
      {/* زر البوت ثابت في الزاوية اليسرى السفلى */}
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
          backgroundColor: "white",
          border: "1px solid #ddd",
          boxShadow: "0 0 8px rgba(0,0,0,0.1)",
          padding: 0,
          cursor: "pointer",
        }}
      >
        <Image
          src="/images/logo/bot.gif"
          alt="Bot"
          width={50} // نفس حجم الزر عندك
          height={50}
          style={{ borderRadius: "50%" }}
        />
      </button>

      {/* صندوق المحادثة */}
      <Drawer
        opened={open}
        onClose={() => setOpen(false)}
        position="right"
        size="sm"
        title="Albasheer AI"
        padding="md"
      >
        <Stack gap="xs" h={400}>
          <ScrollArea h="100%" offsetScrollbars>
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
                    <Text size="sm" dir="rtl">
                      {msg.text}
                    </Text>
                  </Paper>
                </div>
              ))}
            </Stack>
          </ScrollArea>

          <Divider label="خيارات" labelPosition="center" />

          <Group wrap="wrap" justify="start">
            {currentOptions.map((opt, i) => (
              <button
                key={i}
                onClick={() => handleClick(opt)}
                className="px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-blue-100 transition duration-200"
              >
                {opt.label}
              </button>
            ))}
          </Group>
        </Stack>
      </Drawer>
    </>
  );
}
