import pool from "@/app/lib/db";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { email, otp } = await request.json();
    console.log("🔍 بيانات التحقق:", { email, otp });
    if (!email || !otp) {
      return NextResponse.json({ error: "Email and OTP are required" }, { status: 400 });
    }

    

    // البحث عن الكود في قاعدة البيانات بعد التنظيف
    const result = await pool.query(
      `SELECT * FROM otp_codes WHERE email = $1 AND otp = $2`,
      [email, otp]
    );
 
    if (result.rowCount === 0) {
      return NextResponse.json({ error: "رمز التحقق غير صحيح" }, { status: 400 });
    }

    const { created_at } = result.rows[0];

    const now = new Date(Date.now()); // ✅ UTC
    const createdAt = new Date(created_at); // UTC أيضاً
    const diffMinutes = (now.getTime() - createdAt.getTime()) / 60000;
    
    if (diffMinutes > 5) {
      await pool.query(`DELETE FROM otp_codes WHERE email = $1 AND otp = $2`, [email, otp]);
      return NextResponse.json({ error: "انتهت صلاحية رمز التحقق" }, { status: 400 });
    }
    

    // حذف الكود بعد التحقق الناجح
    await pool.query(`DELETE FROM otp_codes WHERE email = $1 AND otp = $2`, [email, otp]);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "فشل التحقق من الرمز" }, { status: 500 });
  }
}
