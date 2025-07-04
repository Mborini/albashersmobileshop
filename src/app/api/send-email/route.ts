// src/app/api/send-email/route.ts
import nodemailer from "nodemailer";
import { NextResponse } from "next/server";
import { generateOrderEmail } from "@/app/lib/email/generateOrderEmail";

export async function POST(request: Request) {
  try {
    const {
      to,
      name,
      phone,
      totalPrice,
      cartItems,
      country,
      city,
      address,
      note,
      lang = "ar", // استقبل اللغة
    } = await request.json();

    const html = generateOrderEmail({
      name,
      phone,
      totalPrice,
      cartItems,
      country,
      city,
      address,
      note,
    });
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USERNAME,
      to,
      subject: lang === "ar" ? "تفاصيل طلبك من البشير شوب " : "Your Order Details from Al-Basheer Shop",
      html,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Email error:", error);
    return NextResponse.json(
      { error: error.message || "خطأ في الإيميل" },
      { status: 500 }
    );
  }
}
