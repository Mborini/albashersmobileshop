// src/app/api/resend-otp/route.ts
import pool from "@/app/lib/db";
import { NextResponse } from "next/server";

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString(); // 6 digits
}

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // حذف الكود القديم
    await pool.query(`DELETE FROM otp_codes WHERE email = $1`, [email]);

    // إنشاء كود جديد
    const otp = generateOTP();
    await pool.query(
      `INSERT INTO otp_codes (email, otp, created_at) VALUES ($1, $2, NOW())`,
      [email, otp]
    );

    // إرسال الإيميل
    const nodemailer = (await import("nodemailer")).default;
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USERNAME,
      to: email,
      subject: "رمز التحقق الجديد (OTP)",
      text: `رمز التحقق الجديد الخاص بك هو: ${otp}`,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "فشل إرسال الكود الجديد" }, { status: 500 });
  }
}
