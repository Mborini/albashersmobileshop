"use Client";

import React, { useState } from "react";
import { TextInput, Select, Button, Group } from "@mantine/core";
import { toast } from "react-hot-toast";

export default function AddAttrForm({ subCategory, onCancel, onSaved }) {
  const [name, setName] = useState("");
  const [inputType, setInputType] = useState("text");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Attribute name is required");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch(`/api/Admin/attributes/${subCategory.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          input_type: inputType,
        }),
      });

      if (!res.ok) throw new Error("Faild on adding")

      toast.success("Attribute added successfully");
      onSaved();
    } catch (error) {
      console.error(error);
      toast.error(  "Failed to add attribute");

            } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <TextInput
        label="Attribute Name"
        value={name}
        onChange={(e) => setName(e.currentTarget.value)}
        required
        radius="xl"
        variant="filled"
      />
      <Select
        label=" Interaction Type"
        data={[
          { value: "text", label: "text" },
          { value: "number", label: "number" },
          { value: "boolean", label: "True/False" },
        ]}
        value={inputType}
        onChange={setInputType}
        required
        radius="xl"
        variant="filled"
      />

      <Group mt="md">
        <Button
          type="submit"
          color="blue"
          loading={isSubmitting}
          disabled={isSubmitting}
          radius="xl"
          variant="light"
        >
          Save
        </Button>
        <Button
          type="button"
          color="red"
          onClick={onCancel}
          disabled={isSubmitting}
          radius="xl"
          variant="light"
        >
          Cancel
        </Button>
      </Group>
    </form>
  );
}
