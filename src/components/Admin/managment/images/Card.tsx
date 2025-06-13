"use client";

import { useDisclosure } from "@mantine/hooks";
import { Center, Drawer } from "@mantine/core";
import { useState } from "react";
import { toast } from "react-hot-toast";
import GridImages from "./List";
import ImagesForm from "./Form";
import { updateAdsImages } from "./services/adsServices";

export default function ImagesCard() {
  const [opened, { open, close }] = useDisclosure(false);
  const [editingImage, setEditingImage] = useState(null);
  
  const handleSubmit = async (data) => {
    if (!editingImage?.id) {
      throw new Error("No image ID to update");
    }
    await updateAdsImages(editingImage.id, data);
  };
  
  
  return (
    <>
      <Center>
        <div
          style={{
            width: "100%",
            maxWidth: "1200px",
            padding: "20px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginTop: "20px",
          }}
        >
          <GridImages
            onEditImage={(image) => {
              setEditingImage(image);
              open();
            }}
          />
        </div>
      </Center>

      <Drawer
        opened={opened}
        onClose={() => {
          setEditingImage(null);
          close();
        }}
        title={editingImage ? "Edit Image" : "Add Image"}
        position="right"
        size="sm"
      >
        <ImagesForm
          image={editingImage}
          onSubmit={async (data) => {
            try {
              await handleSubmit(data);
              setEditingImage(null);
              close();
              toast.success("Image saved successfully!");
            } catch (error) {
              console.error("Error saving image:", error);
              toast.error("Failed to save image.");
            }
          }}
          onCancel={() => {
            setEditingImage(null);
            close();
          }}
        />
      </Drawer>
    </>
  );
}
