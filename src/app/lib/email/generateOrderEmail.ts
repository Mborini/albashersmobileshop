import { t } from "i18next";
import { emailTranslations } from "./emailTranslations";

export function generateOrderEmail({
  name,
  phone,
  cartItems,
  totalPrice,
  country,
  city,
  address,
  note,
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
}) {
  const logoUrl =
    "https://res.cloudinary.com/do1etuooh/image/upload/v1750775950/476908956_642303014852206_4219799890360416472_n_lrbqco.jpg";

  const bannerImage =
    "https://res.cloudinary.com/do1etuooh/image/upload/v1750775946/479965633_642363961512778_4497972418892611363_n_zriu2r.jpg";

  const generateSection = (lang: "ar" | "en") => {
    const t = (key: keyof (typeof emailTranslations)["ar"]) =>
      emailTranslations[lang][key];

    const cartHtml = cartItems
      .map(
        (item) => `
        <tr>
          <td>${item.quantity}x ${item.title}</td>
          <td style="text-align: end;">JOD ${(
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
        <table style="width: 100%; border-collapse: collapse;">
          <tbody>
            ${cartHtml}
            <tr>
              <td>${t("email.shipping")}</td>
              <td style="text-align: end;">${t("email.free")}</td>
            </tr>
            <tr>
              <td><strong>${t("email.total")}</strong></td>
              <td style="text-align: end;"><strong>JOD ${totalPrice.toFixed(
                2
              )}</strong></td>
            </tr>
          </tbody>
        </table>

        <p>${t("email.pay_on_delivery")}</p>
        ${note ? `<p><b>${t("email.notes")}:</b> ${note}</p>` : ""}

        <h3 style="margin-top: 30px; margin-bottom: 10px;">${t(
          "email.delivery_info"
        )}</h3>
        <p>${t("email.deliver_to")} ${country}, ${city}, ${address}</p>

        <h3 style="margin-top: 30px; margin-bottom: 10px;">${t(
          "email.delivery_pay_info"
        )}</h3>
 <p>${t("email.pay_on_delivery")} ${country}, ${city}, ${address}</p>

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
            src="https://res.cloudinary.com/do1etuooh/image/upload/v1750954328/albashername_fl4mi5.png" 
            alt="Side Image" 
            style="height: 40px;  border-radius: 4px;margin-bottom: 5px"
          />
          <div>
            <a href="https://www.facebook.com/AlbasherShop/">
              <img src="https://res.cloudinary.com/do1etuooh/image/upload/v1750952618/facebook_u8ghbn.png" alt="Facebook" style="width: 24px;" />
            </a>
            <a href="https://www.instagram.com/albasher.jo">
              <img src="https://res.cloudinary.com/do1etuooh/image/upload/v1750952620/instagram_sh1qqm.png" alt="Instagram" style="width: 24px;" />
            </a>
            <a href="https://api.whatsapp.com/send?phone=%2B962796855578">
              <img src="https://res.cloudinary.com/do1etuooh/image/upload/v1750952618/whatsapp_knygrh.png" alt="WhatsApp" style="width: 24px;" />
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
