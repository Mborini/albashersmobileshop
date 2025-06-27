// src/app/api/resend-otp/route.ts
import pool from "@/app/lib/db";
import { NextResponse } from "next/server";
import { emailTranslations } from "@/app/lib/email/emailTranslations";
import { generateOtpEmail } from "@/app/lib/email/otp/generateOtpEmail";

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString(); // 6 digits
}

export async function POST(request: Request) {
  try {
    const { email ,lang } = await request.json();

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

    // إعداد nodemailer
    const nodemailer = (await import("nodemailer")).default;
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    // إرسال الإيميل باستخدام قالب HTML
    await transporter.sendMail({
      from: process.env.EMAIL_USERNAME,
      to: email,
      subject: lang === "ar" ? emailTranslations.ar["email.new_otp_subject"] : emailTranslations.en["email.new_otp_subject"],
      html: generateOtpEmail({ otp, lang }),
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "فشل إرسال الكود الجديد" },
      { status: 500 }
    );
  }
}
