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
  lang = "ar", // اللغة الافتراضية
}: {
  name: string;
  phone: string;
  cartItems: { title: string; quantity: number; discountedPrice: number }[];
  totalPrice: number;
  country: string;
  city: string;
  address: string;
  note?: string;
  lang?: "ar" | "en";
}) {
  const t = (key: keyof (typeof emailTranslations)["ar"]) =>
    emailTranslations[lang][key];

  const logoUrl =
    "https://res.cloudinary.com/do1etuooh/image/upload/v1750775950/476908956_642303014852206_4219799890360416472_n_lrbqco.jpg"; // شعارك
  const bannerImage =
    "https://res.cloudinary.com/do1etuooh/image/upload/v1750775946/479965633_642363961512778_4497972418892611363_n_zriu2r.jpg"; // صورة شكر

  const cartHtml = cartItems
    .map(
      (item) => `
      <tr>
        <td>${item.title}</td>
        <td>${item.quantity}</td>
        <td>JOD ${item.discountedPrice}</td>
      </tr>`
    )
    .join("");

  const html = `
<div dir="${
    lang === "ar" ? "rtl" : "ltr"
  }" style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">

      <div style="text-align: center; padding: 20px;">
        <img src="${logoUrl}" alt="Logo" style="max-height: 80px;" />
      </div>
      <h2 style="text-align: center;">${t("email.thanks")}, ${name}!</h2>
      <p>${t("email.confirmation_msg")} <b>${phone}</b></p>

      <h3>${t("email.order_details")}</h3>
      <table width="100%" border="1" cellspacing="0" cellpadding="8">
        <thead>
          <tr>
            <th>${t("email.product")}</th>
            <th>${t("email.quantity")}</th>
            <th>${t("email.price")}</th>
          </tr>
        </thead>
        <tbody>
          ${cartHtml}
          <tr>
            <td colspan="2"><b>${t("email.shipping")}</b></td>
            <td><b>${t("email.free")}</b></td>
          </tr>
          <tr>
            <td colspan="2"><b>${t("email.total")}</b></td>
            <td><b>JOD ${totalPrice.toFixed(2)}</b></td>
          </tr>
        </tbody>
      </table>

      <h3>${t("email.delivery_info")}</h3>
      <p>${t("email.deliver_to")} ${country}, ${city}, ${address}</p>
      ${note ? `<p><b>${t("email.notes")}:</b> ${note}</p>` : ""}

      <div style="margin-top: 20px; text-align: center;">
        <img src="${bannerImage}" alt="thank you" style="max-width: 100%; border-radius: 8px;" />
      </div>

      <p style="text-align: center; color: gray; font-size: 12px;">
        ${t("email.footer")}
      </p>
    </div>
  `;

  return html;
}
