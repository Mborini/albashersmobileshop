import pool from "@/app/lib/db";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString(); // كود مكون من 6 أرقام
}

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const otp = generateOTP();

    // حذف أي كود سابق لهذا الإيميل
    await pool.query(`DELETE FROM otp_codes WHERE email = $1`, [email]);

    // تخزين الكود الجديد في قاعدة البيانات
    await pool.query(
      `INSERT INTO otp_codes (email, otp, created_at) VALUES ($1, $2, NOW())`,
      [email, otp]
    );

    // إعداد nodemailer لإرسال البريد
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
      subject: "رمز التحقق (OTP)",
      text: `رمز التحقق الخاص بك هو: ${otp}`,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "فشل إرسال OTP" }, { status: 500 });
  }
}
