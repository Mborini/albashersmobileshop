import { NextResponse } from "next/server";
import twilio from "twilio";

const accountSid = process.env.TWILIO_ACCOUNT_SID!;
const authToken = process.env.TWILIO_AUTH_TOKEN!;
const client = twilio(accountSid, authToken);

export async function POST(request: Request) {
  try {
    const { phone, message } = await request.json();

    console.log("Sending WhatsApp to:", phone);
    console.log("Message:", message);

    await client.messages.create({
      from: "whatsapp:+14155238886", // رقم واتساب Twilio الخاص بك
      to: `whatsapp:${phone}`,
      body: message,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error sending WhatsApp:", error);
    return NextResponse.json({ error: error.message || "Unknown error" }, { status: 500 });
  }
}
