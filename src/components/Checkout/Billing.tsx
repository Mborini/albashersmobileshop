"use client";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  TextInput,
  Textarea,
  Checkbox,
  Box,
  Group,
  Title,
  Paper,
} from "@mantine/core";

const Billing = () => {
  const { t, i18n } = useTranslation();
  const [email, setEmail] = useState("");
  const [confirmSendEmail, setConfirmSendEmail] = useState(false);

  return (
    <div dir={i18n.language === "ar" ? "rtl" : "ltr"}>
      <Paper bg="black" c="white" shadow="md" radius="lg" p="md" mb="md">
        <Title order={2} size="h4">
          {t("billing.title")}
        </Title>
      </Paper>

      <Paper shadow="md" radius="lg" p="md" mb="xl" withBorder>
        <Group grow align="flex-start" mb="md">
          <TextInput
            variant="filled"
            radius="lg"
            required
            placeholder={t("billing.firstName")}
          />
          <TextInput
            variant="filled"
            radius="lg"
            required
            placeholder={t("billing.lastName")}
          />
        </Group>

        <Group grow align="flex-start" mb="md">
          <Box w="100%">
            <TextInput
              variant="filled"
              radius="lg"
              type="email"
              placeholder={t("billing.email")}
              value={email}
              onChange={(e) => {
                setEmail(e.currentTarget.value);
                if (!e.currentTarget.value) setConfirmSendEmail(false);
              }}
            />
            {email && (
              <Checkbox
                radius="lg"
                
                color="green"
                size="xs"
                label={t("billing.confirmSend")}
                checked={confirmSendEmail}
                onChange={(e) => setConfirmSendEmail(e.currentTarget.checked)}
                mt="sm"
                style={{ color: "green" }}
              />
            )}
          </Box>

          <TextInput
            variant="filled"
            radius="lg"
            required
            placeholder={t("billing.phone")}
          />
        </Group>

        <Group grow align="flex-start" mb="md">
          <TextInput
            variant="filled"
            radius="lg"
            required
            placeholder={t("billing.country")}
          />
          <TextInput
            variant="filled"
            radius="lg"
            required
            placeholder={t("billing.city")}
          />
        </Group>

        <TextInput
          variant="filled"
          radius="lg"
          required
          placeholder={t("billing.addressPlaceholder")}
          mb="md"
        />

        <Textarea
          variant="filled"
          radius="lg"
          placeholder={t("billing.notesPlaceholder")}
          minRows={4}
        />
      </Paper>
    </div>
  );
};

export default Billing;
