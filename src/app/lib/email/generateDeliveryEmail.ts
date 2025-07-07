import { emailTranslations } from "./emailTranslations";

export function generateDeliveryEmail({
  name,
  phone,
  totalPrice,
  country,
  city,
  address,
  note,
  delivery_price,
  payment_method = "cod", // default value
}: {
  name: string;
  phone: string;
  totalPrice: number;
  country: string;
  city: string;
  address: string;
  note?: string;
  delivery_price?: number;
  payment_method?: string;
}) {
  const t = emailTranslations;
  const supportPhone = "0796855578";

  const logoUrl =
    "https://albasheermblshop.s3.eu-north-1.amazonaws.com/Email/WhatsApp+Image+2025-07-07+at+17.40.17_b7c8070f.jpg";

  const bannerImage =
    "https://albasheermblshop.s3.eu-north-1.amazonaws.com/Email/cover%5B1%5D.png";

  const messageEn = t.en["email.order_message"]
    .replace("{name}", name)
    .replace("{city}", city);
  const messageAr = t.ar["email.order_message"]
    .replace("{name}", name)
    .replace("{city}", city);

  const paymentLabelEn =
    payment_method === "cod"
      ? "Cash on Delivery"
      : payment_method === "click"
      ? "Click Payment"
      : "Other";

  const paymentLabelAr =
    payment_method === "cod"
      ? "الدفع عند الاستلام"
      : payment_method === "click"
      ? "دفع من خلال كليك"
      : "طريقة أخرى";

  return `
  <div style="font-family: sans-serif; background-color: #f9f9f9; padding: 20px;">
    <div style="max-width: 600px; margin: auto; background: #fff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 6px rgba(0,0,0,0.1);">

      <!-- Logo -->
      <div style="background: #fff; text-align: center; padding: 20px;">
        <img src="${logoUrl}" alt="Logo" style="width: 100%; height: auto; object-fit: contain; border-radius: 8px;" />
      </div>

      <!-- English -->
      <div style="padding: 20px;">
        <h2 style="text-align: center;">${t.en["email.order_on_the_way"]}</h2>
        <p style="text-align: center; color: #333;">${messageEn}</p>

        <h3>${t.en["email.delivery_info"]}</h3>
        <p>${t.en["email.deliver_to"]} ${country}, ${city}, ${address}</p>

        <h3>${t.en["email.delivery_pay_info"]}</h3>
        <p><strong>Payment Method:</strong> ${paymentLabelEn}</p>
        <p><strong>${t.en["email.Delivery_Price"]}:</strong> JD ${delivery_price?.toFixed(2) ?? "0.00"}</p>
        <p><strong>${t.en["email.total"]}:</strong> JD ${(totalPrice + (delivery_price || 0)).toFixed(2)}</p>

        ${note ? `<p><strong>${t.en["email.notes"]}:</strong> ${note}</p>` : ""}

        <p style="margin-top: 20px; color: #555;">For inquiries, please contact us at: <br/> <strong>${supportPhone}</strong></p>
      </div>

      <!-- Arabic -->
      <div style="padding: 20px; direction: rtl;">
        <h2 style="text-align: center;">${t.ar["email.order_on_the_way"]}</h2>
        <p style="text-align: center; color: #333;">${messageAr}</p>

        <h3>${t.ar["email.delivery_info"]}</h3>
        <p>${t.ar["email.deliver_to"]} ${country}, ${city}, ${address}</p>

        <h3>${t.ar["email.delivery_pay_info"]}</h3>
        <p><strong>طريقة الدفع:</strong> ${paymentLabelAr}</p>
        <p><strong>${t.ar["email.Delivery_Price"]}:</strong> ${delivery_price?.toFixed(2) ?? "0.00"} JD</p>
        <p><strong>${t.ar["email.total"]}:</strong> JD ${(totalPrice + (delivery_price || 0)).toFixed(2)}</p>

        ${note ? `<p><strong>${t.ar["email.notes"]}:</strong> ${note}</p>` : ""}

        <p style="margin-top: 20px; color: #555;">للاستفسار، يرجى التواصل معنا على الرقم:<br/> <strong>${supportPhone}</strong></p>
      </div>

      <!-- Banner -->
      <div style="text-align: center; padding: 20px;">
        <img src="${bannerImage}" alt="Banner" style="width: 100%; border-radius: 0 0 8px 8px;" />
      </div>

      <!-- Footer -->
      <div style="text-align: center; padding: 20px;">
        <img src="https://res.cloudinary.com/do1etuooh/image/upload/v1750954328/albashername_fl4mi5.png" 
             alt="Logo" style="height: 40px; margin-bottom: 10px;" />
        <div>
          <a href="https://www.facebook.com/AlbasherShop/">
            <img src="https://res.cloudinary.com/do1etuooh/image/upload/v1750952618/facebook_u8ghbn.png" style="width: 24px;" />
          </a>
          <a href="https://www.instagram.com/albasher.jo">
            <img src="https://res.cloudinary.com/do1etuooh/image/upload/v1750952620/instagram_sh1qqm.png" style="width: 24px;" />
          </a>
          <a href="https://api.whatsapp.com/send?phone=%2B962796855578">
            <img src="https://res.cloudinary.com/do1etuooh/image/upload/v1750952618/whatsapp_knygrh.png" style="width: 24px;" />
          </a>
        </div>
      </div>

      <!-- Copyright -->
      <div style="background-color: #f2f2f2; padding: 15px; text-align: center; font-size: 12px; color: #777;">
        ${t.en["email.footer"]}<br />
      </div>

    </div>
  </div>
  `;
}
