import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const { name, email, message } = await req.json();

    if (!name || !email || !message) {
      return new Response(
        JSON.stringify({ message: "Missing required fields" }),
        { status: 400 }
      );
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    // رسالة لصاحب الموقع مع RTL
    const siteMailOptions = {
      from: `"${name}" <${process.env.EMAIL_USERNAME}>`,
      replyTo: email,
      to: "albasheermbl@gmail.com",
      subject: " رسالة جديدة من نموذج التواصل",
      html: `
        <div dir="rtl" style="font-family: Arial, sans-serif; padding: 20px; color: #333; text-align: right;">
          <h2>رسالة جديدة من نموذج التواصل</h2>
          <p><strong>الاسم:</strong> ${name}</p>
          <p><strong>البريد الإلكتروني:</strong> ${email}</p>
          <p><strong>الرسالة:</strong></p>
          <p style="background:#f9f9f9; padding:10px; border-right:4px solid #007bff; border-left:none; direction: rtl; text-align: right;">
            ${message.replace(/\n/g, "<br />")}
          </p>
          <hr />
          <p>تم الإرسال من موقع البشير شوب</p>
        </div>
      `,
    };

    const customerMailOptions = {
      from: `"البشير شوب" <${process.env.EMAIL_USERNAME}>`,
      to: email,
      subject: "تم استلام رسالتك - البشير  شوب",
      html: `
        <div dir="rtl" style="font-family: Arial, sans-serif; padding: 20px; color: #333; text-align: right;">
          <h2>شكرًا لتواصلك معنا، ${name}!</h2>
          <p>لقد استلمنا رسالتك وسنرد عليك في أقرب وقت ممكن.</p>
          <hr />
          <h3>نص رسالتك:</h3>
          <p style="background:#f9f9f9; padding:10px; border-right:4px solid #007bff; border-left:none; direction: rtl; text-align: right;">
            ${message.replace(/\n/g, "<br />")}
          </p>
          <p>مع تحيات فريق البشير شوب.</p>
        </div>
      `,
    };

    await Promise.all([
      transporter.sendMail(siteMailOptions),
      transporter.sendMail(customerMailOptions),
    ]);

    return new Response(JSON.stringify({ message: "Email sent successfully" }), {
      status: 200,
    });
  } catch (error) {
    console.error("Email sending error:", error);
    return new Response(
      JSON.stringify({ message: "Failed to send email" }),
      { status: 500 }
    );
  }
}
