"use client";

import { Carousel } from "@mantine/carousel";
import { Box, Title, Card, Grid, Text, Image, Button } from "@mantine/core";
import { FaEdit } from "react-icons/fa";

export default function MainSliderImages({ images, onEditImage }) {
  if (!images || images.length === 0) return null;

  const onlyImages = images.filter((img) => !img.is_video); // تصفية الفيديوهات

  if (onlyImages.length === 0) return null;

  return (
    <Box mt="xl">
      <Title order={3} mb="md">
        Main Slider Images
      </Title>
      <Carousel
  withIndicators
  slideSize="100%"
  slideGap="md"
  
>

        {onlyImages.map((item, index) => (
          <Carousel.Slide key={index}>
            <Card
              withBorder
              radius="md"
              shadow="sm"
              padding="md"
              style={{ cursor: "pointer" }}
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
            >
              
                  <Image
                    src={item.image_Url}
                    alt={item.title}
                    fit="contain"
                    radius="sm"
                    h="100%"
                    w="100%"
                  />
                   <Button leftSection={<FaEdit />} mt="md" color="orange">
                    تعديل
                  </Button>
                
            </Card>
          </Carousel.Slide>
        ))}
      </Carousel>
    </Box>
  );
}
