"use client";
import React, { useState, useEffect } from "react";
import {
  NumberInput,
  Button,
  Group,
  Loader,
  Center,
  Text,
  Divider,
  Paper,
  Title,
  Stack,
  Box,
} from "@mantine/core";
import { toast } from "react-hot-toast";

function DeliveryPrice() {
  const [x, setX] = useState(0);
  const [z, setZ] = useState(0);
  const [lessThanXPrice, setLessThanXPrice] = useState(0);
  const [betweenXZPrice, setBetweenXZPrice] = useState(0);
  const [greaterThanOrEqualZPrice, setGreaterThanOrEqualZPrice] = useState(0);
  const [id, setId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/Admin/delivery-price");
        const data = await res.json();
        if (data) {
          setId(data.id);
          setX(data.less_than_x);
          setZ(data.greater_equal_z);
          setLessThanXPrice(data.price_lt_x);
          setBetweenXZPrice(data.price_between);
          setGreaterThanOrEqualZPrice(data.price_ge_z);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        toast.error("فشل تحميل البيانات");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async () => {
    const payload = {
      id,
      lessThanX: x,
      priceLtX: lessThanXPrice,
      betweenFrom: x,
      betweenTo: z,
      priceBetween: betweenXZPrice,
      greaterOrEqualZ: z,
      priceGeZ: greaterThanOrEqualZPrice,
    };

    try {
      const res = await fetch("/api/Admin/delivery-price", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        toast.success("تم حفظ أسعار التوصيل بنجاح!");
      } else {
        toast.error("فشل في حفظ الأسعار");
      }
    } catch (err) {
      console.error(err);
      toast.error("خطأ أثناء الحفظ");
    }
  };

  if (loading) {
    return (
      <Center className="h-40">
        <Loader />
      </Center>
    );
  }

  return (
    <Box className="max-w-3xl mx-auto p-4 " dir="rtl">
      <Paper shadow="xs" radius="md" p="lg" withBorder>
        <Title order={3} mb="md" ta="center">
          شروط حساب سعر التوصيل
        </Title>

        <Stack >
          {/* Rule 1: value < x */}
          <Group gap="xs" grow align="center">
            <Text fw={500}>إذا</Text>
            <Text>القيمة</Text>
            <Text color="red" fw={700}>
              &lt;
            </Text>
            <NumberInput
              hideControls
              value={x}
              onChange={(val) => {
                if (typeof val === "number") {
                  setX(val);
                } else {
                  setX(0);
                }
              }}
              placeholder="X"
              radius="md"
            />
            <Text fw={600}>=</Text>
            <NumberInput
              hideControls
              value={lessThanXPrice}
onChange={(val) => {
  if (typeof val === 'number') setLessThanXPrice(val);
  else setLessThanXPrice(0);
}}
              placeholder="السعر"
              suffix=" JD"
              radius="md"
            />
          </Group>

          <Divider label="أو" labelPosition="center" my="xs" />

          {/* Rule 2: x ≤ value < z */}
          <Group gap="xs" grow align="center">
            <Text fw={500}>إذا</Text>
            <NumberInput
              hideControls
              value={x}
              onChange={(val) => {
                if (typeof val === "number") {
                  setX(val);
                } else {
                  setX(0);
                }
              }
                }
              placeholder="X"
              radius="md"
            />
            <Text fw={600}>≤ القيمة &lt;</Text>
            <NumberInput
              hideControls
              value={z}
              onChange={(val) => {
                if (typeof val === "number") {
                    setZ(val);
                    }
                else {
                    setZ(0);
                }
              }}
              placeholder="Z"
              radius="md"
            />
            <Text fw={600}>=</Text>
            <NumberInput
              hideControls
              value={betweenXZPrice}
              onChange={(val) => {
                if (typeof val === "number") {
                  setBetweenXZPrice(val);
                } else {
                  setBetweenXZPrice(0);
                }
              }
                }
                
              placeholder="السعر"
              suffix=" JD"
              radius="md"
            />
          </Group>

          <Divider label="أو" labelPosition="center" my="xs" />

          {/* Rule 3: value ≥ z */}
          <Group gap="xs" grow align="center">
            <Text fw={500}>إذا</Text>
            <Text>القيمة</Text>
            <Text color="green" fw={700}>
              ≥
            </Text>
            <NumberInput
              hideControls
              value={z}
              onChange={(val) => {
                if (typeof val === "number") {
                  setZ(val);
                } else {
                  setZ(0);
                }
              }}
              placeholder="Z"
              radius="md"
            />
            <Text fw={600}>=</Text>
            <NumberInput
              hideControls
              value={greaterThanOrEqualZPrice}
              onChange={(val) => {
                if (typeof val === "number") {
                  setGreaterThanOrEqualZPrice(val);
                } else {
                  setGreaterThanOrEqualZPrice(0);
                }
              }
                }
              placeholder="السعر"
              suffix=" JD"
              radius="md"
            />
          </Group>

          <Group mt="md">
            <Button onClick={handleSubmit} color="blue" radius="md">
              حفظ الشروط
            </Button>
          </Group>
        </Stack>
      </Paper>
    </Box>
  );
}

export default DeliveryPrice;
