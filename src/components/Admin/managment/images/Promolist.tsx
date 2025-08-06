"use client";

import { Box, Title, Grid, Card, Button, rem, GridCol } from "@mantine/core";
import Image from "next/image";
import { FaEdit } from "react-icons/fa";
import { Flex } from "@mantine/core";

export default function PromoList({ promo, onEditImage, onActivate }) {
  if (!promo || promo.length === 0) return null;

  return (
    <Box mt="xl">
      <Title order={3} mb="md">
        Promo
      </Title>
      <Grid>
        {promo.map((pid) => (
          <Grid.Col key={pid.id} span={{ base: 12 }}>
            <Card withBorder radius="md" shadow="sm" padding="md">
              <Box
                style={{
                  position: "relative",
                  width: "200px",
                  height: "200px",
                  borderRadius: rem(8),
                  overflow: "hidden",
                }}
              >
                <Image
                  src={pid.image_Url}
                  alt={`Promo image ${pid.id}`}
                  fill
                  style={{ objectFit: "cover" }}
                />
              </Box>

              <Grid.Col span={{ base: 12, sm: 6 }} mt="md">
                <Flex gap="md">
                  <Button
                    fullWidth
                    color="orange"
                    onClick={() =>
                      onEditImage({ id: pid.id, image: pid.image_Url })
                    }
                  >
                    تعديل
                  </Button>
                  <Button
                    fullWidth
                    color={pid.is_active ? "red" : "green"}
                    onClick={() =>
                      onActivate({ id: pid.id, is_active: !pid.is_active })
                    }
                  >
                    {pid.is_active ? "تعطيل" : "تفعيل"}
                  </Button>
                </Flex>
              </Grid.Col>
            </Card>
          </Grid.Col>
        ))}
      </Grid>
    </Box>
  );
}
