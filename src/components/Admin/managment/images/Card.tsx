"use client";

import { useDisclosure } from "@mantine/hooks";
import { Center, Drawer, Container } from "@mantine/core";
import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import GridImages from "./List";
import ImagesForm from "./Form";
import {
  updateAdsImages,
  fetchAdsImages,
  activatePromo,
} from "./services/adsServices";

export default function ImagesCard() {
  const [opened, { open, close }] = useDisclosure(false);
  const [editingImage, setEditingImage] = useState(null);
  const [adsImages, setAdsImages] = useState([]);
  const [loading, setLoading] = useState(true);

  // جلب الصور أول مرة فقط
  useEffect(() => {
    const loadAdsImages = async () => {
      setLoading(true);
      try {
        const data = await fetchAdsImages();
        setAdsImages(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadAdsImages();
  }, []);

  // تحديث الصورة بعد التعديل
  const handleSubmit = async (data) => {
    if (!editingImage?.id) return;

    try {
      await updateAdsImages(editingImage.id, data);

      setAdsImages((prev) =>
        prev.map((img) =>
          img.id === editingImage.id ? { ...img, ...data } : img
        )
      );

      setEditingImage(null);
      close();
      toast.success("تم تحديث الصورة بنجاح!");
    } catch (err) {
      console.error(err);
      toast.error("فشل في تحديث الصورة.");
    }
  };

  // تفعيل أو إلغاء تفعيل الصورة
  const handleActivate = async (image) => {
    try {
      await activatePromo(image.id, image.is_active);

      setAdsImages((prev) =>
        prev.map((img) =>
          img.id === image.id ? { ...img, is_active: !img.is_active } : img
        )
      );

      toast.success("تم تغيير حالة التفعيل!");
    } catch (err) {
      console.error(err);
      toast.error("فشل في تغيير حالة التفعيل.");
    }
  };

  return (
    <>
      <Center>
        <Container
          size="xl"
          px="md"
          py="lg"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginTop: "20px",
            width: "100%",
          }}
        >
          <GridImages
            images={adsImages}
            loading={loading}
            onEditImage={(image) => {
              setEditingImage(image);
              open();
            }}
            onActivate={handleActivate}
          />
        </Container>
      </Center>

      <Drawer
        opened={opened}
        onClose={() => {
          setEditingImage(null);
          close();
        }}
        title="تعديل الصورة"
        position="right"
      >
        <ImagesForm
          image={editingImage}
          onSubmit={handleSubmit}
          onCancel={() => {
            setEditingImage(null);
            close();
          }}
        />
      </Drawer>
    </>
  );
}
