import { t } from "i18next";
import { emailTranslations } from "./emailTranslations";

export function generateOrderEmail({
  name,
  phone,
  email,
  cartItems,
  totalPrice,
  country,
  city,
  address,
  note,
  deliveryPrice,
  paymentMethod,
  grandTotal,
  discountAmount,
}: {
  name: string;
  phone: string;
  email?: string;
  cartItems: { title: string; quantity: number; discountedPrice: number }[];
  totalPrice: number;
  country: string;
  city: string;
  address: string;
  note?: string;
  deliveryPrice?: number;
  paymentMethod?: string;
  grandTotal?: number;
  discountAmount?: number;
}) {
  const logoUrl =
    "https://albasheermblshop.s3.eu-north-1.amazonaws.com/Email/WhatsApp+Image+2025-07-07+at+17.40.17_b7c8070f.jpg";

  const bannerImage =
    "https://albasheermblshop.s3.eu-north-1.amazonaws.com/Email/cover%5B1%5D.png";

  const generateSection = (lang: "ar" | "en") => {
    const t = (key: keyof (typeof emailTranslations)["ar"]) =>
      emailTranslations[lang][key];

    const paymentMethodLabel =
      paymentMethod === "click"
        ? t("email.payment_method_click")
        : t("email.payment_method_cod");

    const cartHtml = cartItems
      .map(
        (item) => `
      <tr>
        <td>${item.quantity}x ${item.title}</td>
        <td style="text-align: end;">JD ${(
          item.discountedPrice * item.quantity
        ).toFixed(2)}</td>
      </tr>`
      )
      .join("");

    return `
    <div dir="${lang === "ar" ? "rtl" : "ltr"}" style="padding: 20px;">
      <h2 style="text-align: center; color: #333; margin-bottom: 10px;">
        ${t("email.thanks")} ${name}!
      </h2>
      <p style="text-align: center; color: #666;">
        ${t("email.confirmation_msg")} <b>${phone}</b>
      </p>

      <h3 style="margin-top: 30px; margin-bottom: 10px;">${t(
        "email.order_details"
      )}</h3>

      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
        <tbody>
          ${cartHtml}
          <tr>
            <td>${t("email.shipping")}</td>
            <td style="text-align: end;">JD ${deliveryPrice ?? 0}</td>
          </tr>
          ${
            discountAmount && discountAmount > 0
              ? `
          <tr>
            <td>${t("email.discount")}</td>
            <td style="text-align: end;">- JD ${discountAmount}</td>
          </tr>`
              : ""
          }
          <tr>
            <td><strong>${t("email.grand_total")}</strong></td>
            <td style="text-align: end;"><strong>JD ${grandTotal}</strong></td>
          </tr>
          
        </tbody>
      </table>

      <div style="background: #e6f4ea; border: 1px solid #7dc37d; border-radius: 8px; padding: 15px; margin-bottom: 20px; font-weight: 600; color: #2d662d;">
        ${t(
          "email.payment_method"
        )}: <span style="font-weight: 700;">${paymentMethodLabel}</span>
      </div>

      ${note ? `<p><b>${t("email.notes")}:</b> ${note}</p>` : ""}

      <h3 style="margin-top: 30px; margin-bottom: 10px;">${t(
        "email.delivery_info"
      )}</h3>
      <p>${t("email.deliver_to")} ${country}, ${city}, ${address}</p>
    </div>
  `;
  };

  return `
    <div style="font-family: sans-serif; background-color: #f9f9f9; padding: 20px;">
      <div style="max-width: 600px; margin: auto; background: #fff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 6px rgba(0,0,0,0.1);">
        <div style="background: #fff; text-align: center; padding: 20px;">
          <img src="${logoUrl}" alt="Logo" style="width: 100%; height: auto; object-fit: contain; border-radius: 8px;" />
        </div>

        ${generateSection("ar")}
        <hr style="margin: 40px 0; border: none; border-top: 1px solid #ccc;" />
        ${generateSection("en")}

        <div style="text-align: center; padding: 20px;">
          <img 
            src="https://albasheermblshop.s3.eu-north-1.amazonaws.com/Email/albashername_fl4mi5.png" 
            alt="Side Image" 
            style="height: 40px; border-radius: 4px; margin-bottom: 5px;"
          />
          <div>
            <a href="https://www.facebook.com/AlbasherShop/">
              <img src="https://albasheermblshop.s3.eu-north-1.amazonaws.com/Email/face.png" alt="Facebook" style="width: 24px;" />
            </a>
            <a href="https://www.instagram.com/albasher.jo">
              <img src="https://albasheermblshop.s3.eu-north-1.amazonaws.com/Email/insta.png" alt="Instagram" style="width: 24px;" />
            </a>
            <a href="https://api.whatsapp.com/send?phone=%2B962796855578">
              <img src="https://albasheermblshop.s3.eu-north-1.amazonaws.com/Email/preview.png" alt="WhatsApp" style="width: 24px;" />
            </a>
          </div>
        </div>

        <div style="text-align: center;">
          <img src="${bannerImage}" alt="Banner" style="width: 100%;" />
        </div>

        <div style="background-color: #f2f2f2; padding: 15px; text-align: center; font-size: 12px; color: #777;">
          ${t("email.footer")}
        </div>
      </div>
    </div>
  `;
}
