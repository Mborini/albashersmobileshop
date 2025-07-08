"use client";

import {
  TextInput,
  Textarea,
  Button,
  Group,
  Title,
  Text,
  Card,
  Stack,
  Grid,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useState } from "react";
import { FaFacebook, FaInstagram } from "react-icons/fa";
import toast, { Toaster } from "react-hot-toast";
import dynamic from "next/dynamic";
import { useTranslation } from "react-i18next";

const Map = dynamic(() => import("../map"), { ssr: false });

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const { t, i18n } = useTranslation();
  const form = useForm({
    initialValues: {
      name: "",
      email: "",
      message: "",
    },
    validate: {
      name: (value) =>
        value.length < 2 ? t("nameTooShort") || "الاسم قصير جداً" : null,
      email: (value) =>
        /^\S+@\S+$/.test(value) ? null : t("invalidEmail") || "البريد غير صالح",
      message: (value) =>
        value.length === 0 ? t("messageRequired") || "الرسالة مطلوبة" : null,
    },
  });

  const handleSubmit = async (values: typeof form.values) => {
    setLoading(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        body: JSON.stringify(values),
        headers: { "Content-Type": "application/json" },
      });

      if (res.ok) {
        toast.success(t("messageSentSuccessfully"));
        form.reset();
      } else {
        toast.error(t("errorOccurredWhileSending"));
      }
    } catch (e) {
      toast.error(t("failedToSendMessage"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto mt-18">
      <Toaster />

      <Title order={2} className="text-center mb-8 text-black">
        {t("contactUs")}
      </Title>

      <Grid gutter="xl">
        <Grid.Col span={{ base: 12, md: 6 }}>
          <form
            onSubmit={form.onSubmit(handleSubmit)}
            dir={i18n.language === "ar" ? "rtl" : "ltr"}
          >
            <Stack>
              <TextInput
                variant="filled"
                radius="xl"
                label={t("name")}
                placeholder={t("enterYourName")}
                {...form.getInputProps("name")}
                styles={{
                  label: {
                    ...(i18n.language === "ar"
                      ? { paddingRight: 8 } // 8 بكسل حشو يمين للعربية
                      : { paddingLeft: 8 }), // 8 بكسل حشو يسار للغات الأخرى
                  },
                }}
              />

              <TextInput
                variant="filled"
                radius="xl"
                label={t("email")}
                placeholder="you@example.com"
                {...form.getInputProps("email")}
                styles={{
                  label: {
                    ...(i18n.language === "ar"
                      ? { paddingRight: 8 } // 8 بكسل حشو يمين للعربية
                      : { paddingLeft: 8 }), // 8 بكسل حشو يسار للغات الأخرى
                  },
                }}
              />
              <Textarea
                variant="filled"
                radius="xl"
                label={t("message")}
                placeholder={t("writeYourMessage")}
                minRows={8}
                {...form.getInputProps("message")}
                styles={{
                  label: {
                    ...(i18n.language === "ar"
                      ? { paddingRight: 8 } // 8 بكسل حشو يمين للعربية
                      : { paddingLeft: 8 }), // 8 بكسل حشو يسار للغات الأخرى
                  },
                }}
              />
              <Button
                type="submit"
                variant="filled"
                radius="xl"
                color="blue"
                fullWidth
                size="md"
                loading={loading}
                style={{
                  backgroundColor: "black",
                  color: "#fff",
                }}
              >
                {t("sendMessage")}
              </Button>
            </Stack>
          </form>

          <Stack mt="xl">
            <Card
              withBorder
              shadow="sm"
              radius="md"
              p="md"
              style={{ backgroundColor: "#f0f4ff" }}
            >
              <Group>
                <FaFacebook size={24} color="#1877F2" />
                <Text
                  component="a"
                  href="https://facebook.com/AlbasherShop"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Albasher Shop- البشير شوب{" "}
                </Text>
              </Group>
            </Card>

            <Card
              withBorder
              shadow="sm"
              radius="md"
              p="md"
              style={{ backgroundColor: "#fff0f5" }}
            >
              <Group>
                <FaInstagram size={24} color="#C13584" />
                <Text
                  component="a"
                  href="https://instagram.com/albasher.jo"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  albasher.jo
                </Text>
              </Group>
            </Card>
          </Stack>
        </Grid.Col>

        {/* القسم الأيمن: الخريطة */}
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Map />
        </Grid.Col>
      </Grid>
    </div>
  );
}
