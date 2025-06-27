"use client";

import { useDisclosure } from "@mantine/hooks";
import { Center, Drawer, Container } from "@mantine/core";
import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import GridImages from "./List";
import ImagesForm from "./Form";
import { updateAdsImages, fetchAdsImages } from "./services/adsServices";

export default function ImagesCard() {
  const [opened, { open, close }] = useDisclosure(false);
  const [editingImage, setEditingImage] = useState(null);
  const [adsImages, setAdsImages] = useState([]);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    loadAdsImages();
  }, []);

  const handleSubmit = async (data) => {
    if (!editingImage?.id) return;

    try {
      await updateAdsImages(editingImage.id, data);
      await loadAdsImages(); // refetch updated list
      setEditingImage(null);
      close();
      toast.success("Image updated successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update image.");
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
  onEditImage={(image) => {
    setEditingImage(image);
    open();
  }}
/>
        </Container>
      </Center>

      <Drawer
        opened={opened}
        onClose={() => {
          setEditingImage(null);
          close();
        }}
        title="Edit Add Image"
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
