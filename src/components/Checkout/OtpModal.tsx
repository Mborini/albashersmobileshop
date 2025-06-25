"use client";

import React, { useState, useEffect } from "react";
import { Modal, TextInput, Button, Group, Text } from "@mantine/core";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";

interface OtpModalProps {
  opened: boolean;
  onClose: () => void;
  email: string;
  onVerified: () => void;
}

const OtpModal: React.FC<OtpModalProps> = ({ opened, onClose, email, onVerified }) => {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [counter, setCounter] = useState(60); // دقيقة
  const { i18n, t } = useTranslation();

  useEffect(() => {
    if (opened) setCounter(60); // إعادة العداد عند فتح المودال
  }, [opened]);

  useEffect(() => {
    if (counter <= 0) return;
    const timer = setInterval(() => setCounter((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [counter]);

  const handleVerify = async () => {
    if (!otp.trim()) {
      toast.error(t("otp.required"));
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || t("otp.invalid"));

      toast.success(t("otp.success"));
      onVerified();
      onClose();
    } catch (error: any) {
      toast.error(error.message || t("otp.invalid"));
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/resend-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || t("otp.invalid"));

      toast.success(t("otp.success1"));
      setCounter(60); // إعادة تشغيل العداد
    } catch (error: any) {
      toast.error(error.message || t("otp.invalid"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={t("email_verification")}
      centered
      dir={i18n.language === "ar" ? "rtl" : "ltr"}
    >
      <Text mb="xs">
        {t("otp_msg")} <b>{email}</b>
      </Text>

      <TextInput
        placeholder={t("6_digits_otp")}
        value={otp}
        onChange={(e) => setOtp(e.currentTarget.value)}
        disabled={loading}
        mb="md"
      />

      <Group position="apart">
        <Button
          variant="light"
          color="gray"
          disabled={counter > 0 || loading}
          onClick={handleResend}
        >
          {counter > 0 ? `${t("resend_after")} ${counter}s` : t("resend_otp")}
        </Button>

        <Button
          onClick={handleVerify}
          loading={loading}
          disabled={loading || otp.trim().length < 6}
        >
          {t("verify")}
        </Button>
      </Group>
    </Modal>
  );
};

export default OtpModal;
