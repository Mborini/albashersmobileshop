"use client";

import { Box, Title, Grid, Card, Button, rem } from "@mantine/core";
import { FaEdit } from "react-icons/fa";

export default function VideoList({ videos, onEditImage }) {
  if (!videos || videos.length === 0) return null;

  return (
    <Box mt="xl">
      <Title order={3} mb="md">الفيديوهات</Title>
      <Grid>
        {videos.map((vid) => (
          <Grid.Col key={vid.id} span={{ base: 12 }}>
            <Card withBorder radius="md" shadow="sm" padding="md">
              <video
                controls
                style={{ width: "100%", borderRadius: rem(8) }}
                src={vid.image_Url}
              >
                Your browser does not support the video tag.
              </video>
              <Button
                fullWidth
                mt="md"
                leftSection={<FaEdit />}
                color="orange"
                onClick={() => onEditImage({ id: vid.id, image: vid.image_Url })}
              >
                تعديل الفيديو
              </Button>
            </Card>
          </Grid.Col>
        ))}
      </Grid>
    </Box>
  );
}
