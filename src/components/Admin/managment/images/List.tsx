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
} from "@mantine/core";
import { Carousel } from "@mantine/carousel";
import "@mantine/carousel/styles.css";
import { fetchAdsImages } from "./services/adsServices";
import { useEffect, useState } from "react";
import { FaEdit } from "react-icons/fa";

export default function GridImages({ onEditImage }) {
  const [adsImages, setAdsImages] = useState([]);
  const [loading, setLoading] = useState(true); // loading state

  useEffect(() => {
    loadAdsImages();
  }, []);

  async function loadAdsImages() {
    setLoading(true);
    try {
      const data = await fetchAdsImages();
      setAdsImages(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  const sliderImages = adsImages.filter((img) => img.is_slider === true);
  const otherImages = adsImages.filter((img) => img.is_slider === false);

  if (loading) {
    return (
      <Center style={{ height: "400px" }}>
        <Loader size="xl" variant="dots" />
      </Center>
    );
  }

  return (
    <Grid gutter="md" align="stretch">
      {/* Left side: Carousel */}
      <Grid.Col span={{ base: 12, md: 8 }}>
        {sliderImages.length > 0 ? (
          <Carousel
            withIndicators
            slideSize="100%"
            slideGap="md"
            sx={{
              ".mantine-Carousel-indicator": {
                backgroundColor: "#999",
                '&[data-active="true"]': {
                  backgroundColor: "#000",
                },
              },
            }}
          >
            {sliderImages.map((item, index) => (
              <Carousel.Slide key={index}>
                <Card
                  shadow="sm"
                  padding="lg"
                  radius="md"
                  withBorder
                  h="100%"
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
                      <Text size="xl" fw={700} color="blue">
                        {Math.floor(
                          ((item.price - item.discounted_Price) / item.price) * 100
                        )}
                        % Sale Off
                      </Text>
                      <Title order={3} mt="sm">
                        {item.title}
                      </Title>
                      <Text mt="sm" c="dimmed" size="sm">
                        {item.description}
                      </Text>
                      <Button color="orange" radius="md" mt="md">
                        <FaEdit />
                      </Button>
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, sm: 6 }}>
                      <Image
                        src={item.image_Url}
                        alt={item.title}
                        fit="contain"
                        h="100%"
                        w="100%"
                      />
                    </Grid.Col>
                  </Grid>
                </Card>
              </Carousel.Slide>
            ))}
          </Carousel>
        ) : (
          <Text>No slider image available</Text>
        )}
      </Grid.Col>
  
      {/* Right side: other images */}
      <Grid.Col span={{ base: 12, md: 4 }}>
        <Stack h="100%" gap="md">
          {otherImages.map((img) => (
            <Card
              key={img.id}
              shadow="sm"
              padding="md"
              radius="md"
              withBorder
              onClick={() =>
                onEditImage({
                  id: img.id,
                  name: img.title,
                  image: img.image_Url,
                  description: img.description,
                  price: img.price,
                  discounted_Price: img.discounted_Price,
                })
              }
              style={{ cursor: "pointer" }}
            >
              <Grid align="center">
                <Grid.Col span={{ base: 12, sm: 6 }}>
                  <Text fw={500}>{img.title}</Text>
                  <Text size="xs" c="dimmed">
                    {img.description}
                  </Text>
                  <Text size="lg" c="red" fw={700}>
                    ${img.discounted_Price}{" "}
                    <Text span c="gray" td="line-through">
                      ${img.price}
                    </Text>
                  </Text>
                  <Button color="orange" radius="md" mt="xs">
                    <FaEdit />
                  </Button>
                </Grid.Col>
                <Grid.Col span={{ base: 12, sm: 6 }}>
                  <Image src={img.image_Url} alt={img.title} fit="contain" />
                </Grid.Col>
              </Grid>
            </Card>
          ))}
        </Stack>
      </Grid.Col>
    </Grid>
  );
  
}
