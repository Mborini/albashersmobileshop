import { emailTranslations } from "../emailTranslations";

export function generateOtpEmail({
  
  otp,
  lang ,
}: {
 
  otp: string;
  lang?: "ar" | "en";
}) {
const selectedLang = lang === "ar" || lang === "en" ? lang : "ar";
const t = (key: keyof typeof emailTranslations["ar"]) =>
  emailTranslations[selectedLang][key] ?? key;

  const logoUrl =
    "https://res.cloudinary.com/do1etuooh/image/upload/v1750775950/476908956_642303014852206_4219799890360416472_n_lrbqco.jpg";

  return `
  <div dir="${lang === "ar" ? "rtl" : "ltr"}" style="font-family: sans-serif; background-color: #f9f9f9; padding: 20px;">
    <div style="max-width: 600px; margin: auto; background: #fff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 6px rgba(0,0,0,0.1);">

      <div style="background: #fff; text-align: center; padding: 20px;">
        <img src="${logoUrl}" alt="Logo" style="width: 100%; height: auto; object-fit: contain; border-radius: 8px;" />
      </div>

      <div style="padding: 20px; text-align: center;">
        <h2 style="color: #333;">${t("email.otp_heading")}</h2>
        <p style="font-size: 18px; color: #444;">
         
          <strong style="font-size: 24px; color: #000;">${otp}</strong>
        </p>
        
      </div>

      <div style="background-color: #f2f2f2; padding: 15px; text-align: center; font-size: 12px; color: #777;">
        ${t("email.footer")}
      </div>

    </div>
  </div>
  `;
}
