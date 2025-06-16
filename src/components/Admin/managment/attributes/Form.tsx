import React, { useState, useEffect } from "react";
import { TextInput, Button, Select, Loader, Text } from "@mantine/core";
import { toast } from "react-hot-toast";

export default function AttrsSubCategoryForm({ subCategory, onCancel }) {
  const [attrData, setAttrData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function loadAttrs() {
      if (!subCategory?.id) return;
      setLoading(true);
      try {
        const res = await fetch(`/api/Admin/attributes/${subCategory.id}`);
        if (!res.ok) throw new Error("Failed to load attributes");
        const data = await res.json();
        setAttrData(data);
      } catch (error) {
        console.error(error);
        toast.error("Error loading attributes");
      } finally {
        setLoading(false);
      }
    }
    loadAttrs();
  }, [subCategory]);

  const handleAttrChange = (index, field, value) => {
    const updated = [...attrData];
    updated[index][field] = value;
    setAttrData(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!subCategory?.id) {
      toast.error("Subcategory not selected");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/Admin/attributes/${subCategory.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ attributes: attrData }),
      });
      if (!res.ok) throw new Error("Failed to update attributes");
      toast.success("Attributes updated successfully");
      onCancel();
    } catch (error) {
      console.error(error);
      toast.error("Error updating attributes");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Text size="lg">
        Editing Attributes for SubCategory: {subCategory?.name}
      </Text>

      {attrData.length === 0 && (
        <Text color="dimmed">no attributes found for this subcategory</Text>
      )}

      {attrData.map((attr, index) => (
        <div key={attr.id} className="grid grid-cols-2 gap-4">
          <TextInput
            label="Attribute Name"
            value={attr.name}
            onChange={(e) =>
              handleAttrChange(index, "name", e.currentTarget.value)
            }
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
            value={attr.input_type}
            onChange={(value) => handleAttrChange(index, "input_type", value)}
            required
            radius="xl"
            variant="filled"
          />
        </div>
      ))}
      {attrData.length != 0 && (
        <div className="flex justify-center space-x-4 pt-4">
          <Button
            type="submit"
            color="blue"
            loading={isSubmitting}
            disabled={isSubmitting}
            radius="xl"
            variant="light"
          >
            Save{" "}
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
        </div>
      )}
    </form>
  );
}
