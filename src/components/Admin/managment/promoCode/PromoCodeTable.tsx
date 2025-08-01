"use client";

import {
  Button,
  Drawer,
  Group,
  NumberInput,
  Table,
  TextInput,
  Title,
  ActionIcon,
  Tooltip,
  Modal,
  Select,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useEffect, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import toast, { Toaster } from "react-hot-toast";

export interface PromoCode {
  id: string;
  name: string;
  brandId?: string;
  brand_name?: string; // Optional for displaying brand name
  discount: number;
  created_at?: string;
  expiry_date?: string | null; // Optional for expiry date
}
interface Brand {
  id: string;
  name: string;
}

export default function PromoCodeTable() {
  const [opened, { open, close }] = useDisclosure(false);
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([]);
  const [editing, setEditing] = useState<PromoCode | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [brandId, setBrandId] = useState<string | null>(null);
  const [expiry_date, setExpiryDate] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [discount, setDiscount] = useState<number | undefined>(undefined);

  useEffect(() => {
    fetchPromoCodes();
    fetchBrands();
  }, []);

  const fetchBrands = async () => {
    try {
      const res = await fetch("/api/Admin/promocode_brands");
      const data = await res.json();
      setBrands(data);
    } catch (err) {
      console.error("Failed to load brands", err);
    }
  };

  const fetchPromoCodes = async () => {
    try {
      const res = await fetch("/api/Admin/promoCode");
      const data = await res.json();
      setPromoCodes(data);
    } catch (err) {
      console.error("Failed to load promo codes", err);
    }
  };

  const resetForm = () => {
    setName("");
    setDiscount(undefined);
    setEditing(null);
    setExpiryDate(null);
  };

  const handleSubmit = async () => {
    if (!name || name.length !== 6) {
      toast.error("Promo code name must be exactly 6 characters.");
      return;
    }

    if (discount === undefined) {
      toast.error("Please enter a discount value.");
      return;
    }

    const promoData = { name, discount, brandId, expiry_date };

    try {
      const method = editing ? "PUT" : "POST";
      const response = await fetch("/api/Admin/promoCode", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          editing ? { ...editing, ...promoData } : promoData
        ),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success(editing ? "Promo code updated" : "Promo code added");
        await fetchPromoCodes();
        resetForm();
        close();
      } else {
        toast.error(result?.message || "Failed to save promo code");
      }
    } catch (err) {
      console.error("Failed to save promo code", err);
    }
  };
  const handleEdit = (code: PromoCode & { brandId?: string | number }) => {
    setEditing(code);
    setName(code.name);
    setDiscount(code.discount);
    setBrandId(code.brandId ? String(code.brandId) : null);
    setExpiryDate(code.expiry_date ? code.expiry_date.substring(0, 10) : null);

    open();
  };

  const handleDelete = (id: string) => {
    setDeleteId(id);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;

    try {
      const res = await fetch(`/api/Admin/promoCode/${deleteId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        toast.success("Promo code deleted successfully");
        await fetchPromoCodes();
      } else {
        const error = await res.json();
        toast.error(error?.message || "Failed to delete");
      }
    } catch (err) {
      console.error("Failed to delete promo code", err);
      toast.error("Something went wrong");
    } finally {
      setDeleteId(null);
    }
  };

  return (
    <div className="p-4">
      <Toaster position="top-center" />

      <Group justify="space-between" mb="md">
        <Title order={2}>Promo Code Management</Title>
        <Button
          variant="light"
          color="green"
          size="sm"
          radius="xl"
          onClick={() => {
            resetForm();
            open();
          }}
        >
          Add Promo Code
        </Button>
      </Group>
      <div className="overflow-x-auto rounded-xl border border-gray-2 shadow-sm">
        <Table
          striped
          highlightOnHover
          withTableBorder
          withColumnBorders
          className="text-sm min-w-[600px]"
        >
          <thead className="bg-gray-100 text-gray-700 uppercase tracking-wider">
            <tr>
              <th className="text-left px-4 py-3">Promo Code</th>
              <th className="text-center px-4 py-3">Discount</th>
              <th className="text-center px-4 py-3">Brand</th>

              <th className="text-center px-4 py-3">Created</th>
              <th className="text-center px-4 py-3">Expires</th>
              <th className="text-center px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="text-center text-gray-800">
            {promoCodes.length > 0 ? (
              promoCodes.map((code) => (
                <tr
                  key={code.id}
                  className="hover:bg-gray-50 transition-colors duration-200"
                >
                  <td className="text-left px-4 py-3 font-medium">
                    {code.name}
                  </td>
                  <td className="px-4 py-3 text-green-700 font-semibold">
                    {Number(code.discount).toFixed(0)}%
                  </td>
                  <td className="px-4 py-3 text-gray-700">{code.brand_name}</td>

                  <td className="px-4 py-3 text-gray-600">
                    {code.created_at
                      ? new Date(code.created_at).toLocaleDateString()
                      : "-"}
                  </td>
                  <td
                    className={`px-4 py-3 ${
                      code.expiry_date &&
                      new Date(code.expiry_date) < new Date()
                        ? "text-red-light font-bold p-2 bg-red-light-4 rounded"
                        : "text-green-dark font-bold p-2 bg-green-light-4 rounded"
                    }`}
                  >
                    {code.expiry_date
                      ? new Date(code.expiry_date).toLocaleDateString()
                      : "-"}
                  </td>

                  <td className="px-4 py-3">
                    <Group gap="xs" justify="center">
                      <Tooltip label="Edit">
                        <ActionIcon
                          onClick={() => handleEdit(code)}
                          color="orange"
                          variant="light"
                          radius="xl"
                        >
                          <FaEdit size={16} />
                        </ActionIcon>
                      </Tooltip>
                      <Tooltip label="Delete">
                        <ActionIcon
                          onClick={() => handleDelete(code.id)}
                          color="red"
                          variant="light"
                          radius="xl"
                        >
                          <FaTrash size={16} />
                        </ActionIcon>
                      </Tooltip>
                    </Group>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="text-center py-6 text-gray-500">
                  No promo codes yet.
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>

      {/* Drawer for Add/Edit */}
      <Drawer
        opened={opened}
        onClose={() => {
          resetForm();
          close();
        }}
        title={editing ? "Edit Promo Code" : "Add Promo Code"}
        position="right"
        size="md"
      >
        <TextInput
          variant="filled"
          radius={"xl"}
          label="Promo Code Name"
          placeholder="e.g., SAVE10"
          value={name}
          onChange={(e) => setName(e.currentTarget.value)}
          mb="sm"
          description="Must be exactly 6 characters"
          error={
            name.length > 0 && name.length !== 6
              ? "Must be 6 characters"
              : undefined
          }
        />

        <NumberInput
          label="Discount (%)"
          placeholder="e.g., 10"
          variant="filled"
          radius={"xl"}
          value={discount}
          onChange={(value) => {
            if (typeof value === "number") {
              setDiscount(value);
            }
          }}
          min={0}
          max={100}
        />
        <Select
          label="Brand"
          variant="filled"
          radius="xl"
          placeholder="Select brand"
          data={brands.map((b) => ({ value: String(b.id), label: b.name }))}
          value={brandId ?? ""}
          onChange={(value) => setBrandId(value)} // value هي دائمًا string
          searchable
          required
          mb="sm"
        />
        <TextInput
          label="Expiry Date"
          placeholder="YYYY-MM-DD"
          variant="filled"
          radius="xl"
          value={expiry_date ?? ""}
          onChange={(e) => setExpiryDate(e.currentTarget.value)}
          type="date"
          mb="sm"
        />

        <Group mt="md" justify="end">
          <Button onClick={handleSubmit}>{editing ? "Update" : "Add"}</Button>
        </Group>
      </Drawer>

      {/* Confirm Delete Modal */}
      <Modal
        opened={!!deleteId}
        onClose={() => setDeleteId(null)}
        title="Confirm Deletion"
        centered
        withCloseButton={false}
      >
        <p>Are you sure you want to delete this promo code?</p>
        <Group mt="md" justify="end">
          <Button variant="default" onClick={() => setDeleteId(null)}>
            Cancel
          </Button>
          <Button color="red" onClick={confirmDelete}>
            Delete
          </Button>
        </Group>
      </Modal>
    </div>
  );
}
