// src/app/api/send-email/route.ts
import nodemailer from "nodemailer";
import { NextResponse } from "next/server";
import { generateDeliveryEmail } from "@/app/lib/email/generateDeliveryEmail";

export async function POST(request: Request) {
  try {
    const { to, name, phone, totalPrice, country, city, address, note } =
      await request.json();

    const html = generateDeliveryEmail({
      name,
      phone,
      totalPrice,
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
      subject: "طلبك قيد التوصيل",
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
