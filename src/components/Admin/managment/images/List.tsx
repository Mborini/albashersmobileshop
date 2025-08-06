"use client";

import {
  Grid,
  Card,
  Image,
  Text,
  Button,
  Stack,
  Title,
  Loader,
  Center,
  Box,
  rem,
} from "@mantine/core";
import { Carousel } from "@mantine/carousel";
import "@mantine/carousel/styles.css";
import { FaEdit } from "react-icons/fa";
import MainSliderImages from "./MainSliderImages";
import VideoList from "./VideoList";
import PromoList from "./Promolist";

export default function GridImages({
  images,
  loading,
  onEditImage,
  onActivate,
}) {
  // نستخدم البيانات القادمة من الأعلى
  const adsImages = images;

  // تصنيفات الصور
  const mainSliderImages = adsImages.filter(
    (img) => img.is_slider && img.is_main
  );
  const sliderImages = adsImages.filter(
    (img) => img.is_slider && !img.is_main && !img.is_video
  );
  const otherImages = adsImages.filter(
    (img) => !img.is_slider && !img.is_main && !img.is_video
  );
  const videoImages = adsImages.filter((img) => img.is_video);
  const promoImage = adsImages.filter((img) => img.is_promo);

  if (loading) {
    return (
      <Center h={400}>
        <Loader size="xl" variant="dots" />
      </Center>
    );
  }

  // كرت الصورة
  const ImageCard = ({ item }) => (
    <Card
      withBorder
      radius="md"
      shadow="sm"
      padding="md"
      onClick={() =>
        onEditImage({
          id: item.id,
          name: item.title,
          image: item.image_Url,
          description: item.description,
          price: item.price,
          discounted_Price: item.discounted_Price,
        })
      }
      style={{ cursor: "pointer" }}
    >
      <Grid align="center">
        <Grid.Col span={{ base: 12, sm: 6 }}>
          <Text fw={700} size="xl" c="blue">
            {Math.floor(
              ((item.price - item.discounted_Price) / item.price) * 100
            )}
            % خصم
          </Text>
          <Title order={4} mt="xs">
            {item.title}
          </Title>
          <Text mt="xs" c="dimmed" size="sm">
            {item.description}
          </Text>
          <Text size="lg" mt="sm" fw={700} c="red">
            ${item.discounted_Price}{" "}
            <Text span td="line-through" c="gray">
              ${item.price}
            </Text>
          </Text>
          <Button leftSection={<FaEdit />} mt="md" color="orange">
            تعديل
          </Button>
        </Grid.Col>
        <Grid.Col span={{ base: 12, sm: 6 }}>
          <Image
            src={item.image_Url}
            alt={item.title}
            fit="contain"
            radius="sm"
            h="100%"
            w="100%"
          />
        </Grid.Col>
      </Grid>
    </Card>
  );

  // قسم السلايدر
  const SliderSection = ({ title, images }) =>
    images.length > 0 ? (
      <Box mt="xl">
        {title && (
          <Title order={3} mb="md">
            {title}
          </Title>
        )}
        <Carousel withIndicators slideSize="100%" slideGap="md">
          {images.map((item, index) => (
            <Carousel.Slide key={index}>
              <ImageCard item={item} />
            </Carousel.Slide>
          ))}
        </Carousel>
      </Box>
    ) : (
      <Text>لا يوجد {title?.toLowerCase()}</Text>
    );

  return (
    <>
      <Grid gutter="md">
        <Grid.Col span={12}>
          <Grid.Col span={12}>
            <Grid>
              <Grid.Col span={{ base: 12, md: 4 }}>
                <MainSliderImages
                  images={mainSliderImages}
                  onEditImage={onEditImage}
                />
              </Grid.Col>

              <Grid.Col span={{ base: 12, md: 4 }}>
                <VideoList videos={videoImages} onEditImage={onEditImage} />
              </Grid.Col>

              <Grid.Col span={{ base: 12, md: 4 }}>
                <PromoList
                  promo={promoImage}
                  onEditImage={onEditImage}
                  onActivate={onActivate}
                />
              </Grid.Col>
            </Grid>
          </Grid.Col>
        </Grid.Col>
      </Grid>
    </>
  );
}
