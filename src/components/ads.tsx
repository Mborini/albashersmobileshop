"use client";

import { useEffect, useState } from "react";
import { Modal, Image } from "@mantine/core";
import { fetchAdsImages } from "./Admin/managment/images/services/adsServices";

export default function PromoModal() {
  const [opened, setOpened] = useState(false);
  const [adsImages, setAdsImages] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadAdsImages = async () => {
    setLoading(true);
    try {
      const data = await fetchAdsImages();

      setAdsImages(data);
    } catch (error) {
      console.error("خطأ أثناء تحميل الصور:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdsImages();
  }, []);

  const promo = adsImages.find((img) => img.is_promo === true && img.is_active === true);
  
  // فتح المودال تلقائيًا بعد تحميل الصورة إذا كانت موجودة
  useEffect(() => {
    if (!loading && promo) {
      setOpened(true);
    }
  }, [loading, promo]);

  return (
    <Modal
      opened={opened}
      onClose={() => setOpened(false)}
      withCloseButton={false}
      centered
      size="auto"
      padding={0}
      radius="md"
      styles={{
        body: { padding: 0 },
        content: { backgroundColor: "transparent" },
      }}
    >
      {promo && (
        <div style={{ width: 400, height: 400, overflow: 'hidden', borderRadius: 12 }}>
  <Image
    src={promo.image_Url}
    alt="عرض البشير"
    fit="cover"
    width="100%"
    height="100%"
  />
</div>

      )}
    </Modal>
  );
}
