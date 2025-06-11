import React, { useEffect, useState, useRef } from "react";
import {
  Modal,
  Text,
  Group,
  List,
  Select,
  TextInput,
  Stack,
  Checkbox,
  Button,
  Grid,
} from "@mantine/core";
import { fetchSubCategories } from "../../subCategories/services/SubCategoryService";
import { fetchAttributes, updateAttributes } from "../services/Products";
import { FaCheckCircle } from "react-icons/fa";
import { VscError } from "react-icons/vsc";

export default function EditSubCategoryModal({ opened, onClose, product }) {
  const [subcategories, setSubcategories] = useState([]);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [attributes, setAttributes] = useState([]);
  const [attributeValues, setAttributeValues] = useState({});
  const [loading, setLoading] = useState(false);
  const [isChanged, setIsChanged] = useState(false);

  // Save original values for comparison
  const originalData = useRef({
    subCategoryId: null,
    attributes: {},
  });

  useEffect(() => {
    async function loadSubCategories() {
      try {
        const subcategoriesData = await fetchSubCategories();
        setSubcategories(subcategoriesData);
      } catch (error) {
        console.error(error);
      }
    }
    loadSubCategories();

    if (product) {
      const subCatId = String(product.subCategoryId || "");
      setSelectedSubcategory(subCatId);
      originalData.current.subCategoryId = subCatId;

      if (subCatId) {
        loadAttributes(subCatId);
      }

      const attrs = product.attributes || {};
      setAttributeValues(
        Object.entries(attrs).reduce((acc, [key, value]) => {
          acc[key] = String(value);
          return acc;
        }, {})
      );
      originalData.current.attributes = Object.entries(attrs).reduce(
        (acc, [key, value]) => {
          acc[key] = String(value);
          return acc;
        },
        {}
      );

      setIsChanged(false);
    }
  }, [product, opened]);

  async function loadAttributes(subCategoryId) {
    try {
      const attributesData = await fetchAttributes(subCategoryId);
      setAttributes(attributesData);
      setAttributeValues({}); // clear inputs when new subcategory selected
      setIsChanged(true);
    } catch (error) {
      console.error(error);
    }
  }

  // Compare current state with original to detect changes
  function checkIfChanged(newSubCat, newAttrs) {
    if (newSubCat !== originalData.current.subCategoryId) return true;

    const origAttrs = originalData.current.attributes;

    // Check if keys or values differ
    const origKeys = Object.keys(origAttrs);
    const newKeys = Object.keys(newAttrs);
    if (origKeys.length !== newKeys.length) return true;

    for (const key of newKeys) {
      if (newAttrs[key] !== origAttrs[key]) return true;
    }

    return false;
  }

  const handleSelectChange = (value) => {
   
    setSelectedSubcategory(value);
    if (value) {
      loadAttributes(value);
    } else {
      setAttributes([]);
      setAttributeValues({});
    }

    const changed = checkIfChanged(value, attributeValues);
    setIsChanged(changed);
  };

  const handleAttributeChange = (attrId, value) => {
    const newAttrValues = { ...attributeValues, [attrId]: value };
    // Remove attribute if empty or unchecked
    if (
      value === "" ||
      value === undefined ||
      value === null ||
      value === "false"
    ) {
      delete newAttrValues[attrId];
    }
    setAttributeValues(newAttrValues);

    const changed = checkIfChanged(selectedSubcategory, newAttrValues);
    setIsChanged(changed);
  };

  const handleCheckboxToggle = (attrId, checked) => {
    const attr = attributes.find((a) => a.id === attrId);
    const newAttrValues = { ...attributeValues };

    if (checked) {
      // ✅ set a better default: "false" for booleans, "" for others
      newAttrValues[attrId] = attr?.input_type === "boolean" ? "false" : "";
    } else {
      delete newAttrValues[attrId];
    }

    setAttributeValues(newAttrValues);

    const changed = checkIfChanged(selectedSubcategory, newAttrValues);
    setIsChanged(changed);
  };
  const resetForm = () => {
    setSelectedSubcategory(null);
    setAttributes([]);
    setAttributeValues({});
    setIsChanged(false);
    setLoading(false);
    originalData.current = {
      subCategoryId: null,
      attributes: {},
    };
  };
  
  async function handleUpdate() {
    if (!product?.product_id) return;

    setLoading(true);

    try {
      const payload = {
        subCategoryId: selectedSubcategory,
        attributes: attributeValues,
      };

      await updateAttributes(product.product_id, payload);

      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  // Show product attributes (read-only)
  const attributesArray = product?.attributes
    ? Object.entries(product.attributes).map(([key, value]) => ({
        name: key,
        value,
      }))
    : [];

  return (
    <Modal
      opened={opened}
      onClose={() => {
        resetForm();
        onClose();
      }}
      size="lg"
      centered
      overlayProps={{
        backgroundOpacity: 0.55,
        blur: 3,
      }}
      withCloseButton={!loading}
      closeOnClickOutside={!loading}
      closeOnEscape={!loading}
      title={<Text  fw={700}
      mb="xs"
      variant="gradient"
      gradient={{ from: "indigo", to: "cyan" }}>Edit Subcategory and Attributes</Text>}

    >
      
      <Grid>
        <Grid.Col span={6}>
        <Text
            fw={500}
            mb="xs"
            variant="gradient"
            gradient={{ from: "indigo", to: "cyan" }}
          >
            Current Subcategory
          </Text>
          <Text mb="md" size="sm" fw={500} mt="md" ml="xs">
            {product?.subcategory_name || "No subcategory selected."}
          </Text>
          <Text
            fw={500}
            mb="xs"
            variant="gradient"
            gradient={{ from: "indigo", to: "cyan" }}
          >
            Current Attributes
          </Text>
          {attributesArray.length > 0 ? (
            <List spacing="xs" size="sm" withPadding>
              {attributesArray.map((attr, index) => (
                <List.Item key={index}>
                  <div className="flex items-center gap-2">
                    <strong>{attr.name}:</strong>{" "}
                    {attr.value === "true" ? (
                      <>
                        <FaCheckCircle size={18} color="green" />
                        <span>Yes</span>
                      </>
                    ) : attr.value === "false" ? (
                      <>
                        <VscError size={18} color="red" />
                        <span>No</span>
                      </>
                    ) : (
                      <span>{attr.value}</span>
                    )}
                  </div>
                </List.Item>
              ))}
            </List>
          ) : (
            <Text size="sm" c="dimmed">
              No attributes available.
            </Text>
          )}
        </Grid.Col>
        <Grid.Col span={6}>
       
          <Select
            variant="filled"
            radius="xl"
            label={<Text variant="gradient" gradient={{ from: "indigo", to: "cyan" }} fw={500}>Select Subcategory</Text>}
            placeholder="Choose one"
            data={subcategories.map((sub) => ({
              value: String(sub.id),
              label: sub.name,
            }))}
            value={selectedSubcategory}
            onChange={handleSelectChange}
            mb="md"
            disabled={loading}
          />
          {attributes.length > 0 && (
            <>
              <Text fw={500} mt="md" mb="xs">
                Fill New Attributes
              </Text>
              <Stack spacing="sm">
                {attributes.map((attr) => {
                  const isSelected = attributeValues[attr.id] !== undefined;

                  return (
                    <Group
                      key={attr.id}
                      align="center"
                      position="apart"
                      spacing="sm"
                    >
                      <Checkbox
                        label={attr.name}
                        radius="xl"
                        size="sm"
                        checked={isSelected}
                        disabled={loading}
                        onChange={(e) =>
                          handleCheckboxToggle(attr.id, e.currentTarget.checked)
                        }
                      />

                      {isSelected &&
                        (attr.input_type === "boolean" ? (
                          <Checkbox
                            label={`Is ${attr.name}?`}
                            size="sm"
                            radius="xl"
                            checked={attributeValues[attr.id] === "true"}
                            disabled={loading}
                            onChange={(e) =>
                              handleAttributeChange(
                                attr.id,
                                e.currentTarget.checked ? "true" : "false"
                              )
                            }
                          />
                        ) : (
                          <TextInput
                            size="sm"
                            radius="xl"
                            placeholder={`Enter value for ${attr.name}`}
                            value={attributeValues[attr.id]}
                            disabled={loading}
                            onChange={(e) =>
                              handleAttributeChange(
                                attr.id,
                                e.currentTarget.value
                              )
                            }
                          />
                        ))}
                    </Group>
                  );
                })}
              </Stack>
            </>
          )}
        </Grid.Col>
      </Grid>
      <Group mt="xl">
        <Button
          variant="light"
          radius="xl"
          onClick={handleUpdate}
          loading={loading}
          disabled={loading || !isChanged}
        >
          Update
        </Button>
      </Group>
    </Modal>
  );
}
