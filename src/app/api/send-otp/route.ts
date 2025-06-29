import pool from "@/app/lib/db";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { emailTranslations } from "@/app/lib/email/emailTranslations";
import { generateOtpEmail } from "@/app/lib/email/otp/generateOtpEmail";

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(request: Request) {
  try {
    const { email,lang } = await request.json();
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const otp = generateOTP();
    await pool.query(`
      DELETE FROM otp_codes
WHERE NOW() - created_at > INTERVAL '5 minutes'   `);
    
    
    await pool.query(
      `INSERT INTO otp_codes (email, otp, created_at) VALUES ($1, $2, NOW())`,
      [email, otp]
    );
    console.log("✅ OTP saved to DB:", { email, otp });
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
      subject: lang === "ar" ? emailTranslations.ar["email.otp_subject"] : emailTranslations.en["email.otp_subject"],
      html: generateOtpEmail({ otp, lang }),
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "فشل إرسال OTP" },
      { status: 500 }
    );
  }
}
