"use client";

import {
  Table,
  TextInput,
  ColorInput,
  Button,
  Loader,
  Center,
} from "@mantine/core";
import { useEffect, useState } from "react";

interface Color {
  id: number;
  name: string;
  hex_code: string;
}

export default function ColorTable() {
  const [colors, setColors] = useState<Color[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<number | null>(null);

  useEffect(() => {
    const fetchColors = async () => {
      try {
        const res = await fetch("/api/colors");
        const data = await res.json();
        setColors(data);
      } finally {
        setLoading(false);
      }
    };

    fetchColors();
  }, []);

  const handleChange = (index: number, field: keyof Color, value: string) => {
    const updated = [...colors];
    if (field === "name" || field === "hex_code") {
      updated[index][field] = value;
      setColors(updated);
    }
  };

  const handleSave = async (color: Color) => {
    setSaving(color.id);
    try {
      await fetch(`/api/Admin/colors/${color.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: color.name,
          hex_code: color.hex_code,
        }),
      });
    } catch (error) {
      console.error("Error saving color:", error);
    } finally {
      setSaving(null);
    }
  };

  if (loading) {
    return (
      <Center py="xl">
        <Loader />
      </Center>
    );
  }

  return (
 <Table
  striped
  highlightOnHover
  withColumnBorders
  style={{
    minWidth: 600,
    maxWidth: "50%",
    margin: "0 auto",  
  }}
>

  <thead>
    <tr style={{ textAlign: "center" }}>
      <th style={{ width: 150 }}>Color Name</th>
      <th style={{ width: 150 }}>Color Hex</th>
      <th style={{ width: 80 }}>Actions</th>
    </tr>
  </thead>
  <tbody>
    {colors.map((color, index) => (
      <tr key={color.id} style={{ textAlign: "center" }}>
        <td>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div
              style={{
                width: 24,
                height: 24,
                backgroundColor: color.hex_code,
                borderRadius: 4,
                border: "1px solid #ccc",
              }}
            />
            <TextInput
              size="xs"
              style={{ flexGrow: 1 }}
              value={color.name}
              onChange={(e) =>
                handleChange(index, "name", e.currentTarget.value)
              }
            />
          </div>
        </td>
        <td>
          <ColorInput
            size="xs"
            style={{ minWidth: 100 }}
            value={color.hex_code}
            onChange={(val) => handleChange(index, "hex_code", val)}
            format="hex"
            disallowInput={false}
            withPicker
          />
        </td>
        <td>
          <Button
            onClick={() => handleSave(color)}
            size="xs"
            loading={saving === color.id}
            style={{ minWidth: 60 }}
          >
            Save
          </Button>
        </td>
      </tr>
    ))}
  </tbody>
</Table>

  );
}
