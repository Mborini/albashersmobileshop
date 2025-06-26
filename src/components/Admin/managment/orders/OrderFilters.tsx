"use client";
import React, { useState, useEffect } from "react";
import { TextInput, Select, Checkbox, Group, Paper } from "@mantine/core";

function OrderFilters({ orders, onFilter }) {
  const [firstname, setFirstname] = useState("");
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState(""); // 'pending', 'completed', ''
  const [itemTitle, setItemTitle] = useState("");
  const [dateRange, setDateRange] = useState([null, null]);

  useEffect(() => {
    let filtered = orders;
    if (dateRange[0] && dateRange[1]) {
      filtered = filtered.filter((order) => {
        const orderDate = new Date(order.created_at);
        return orderDate >= dateRange[0] && orderDate <= dateRange[1];
      });
    }

    if (firstname.trim()) {
      filtered = filtered.filter((order) =>
        order.firstname?.toLowerCase().includes(firstname.toLowerCase())
      );
    }

    if (phone.trim()) {
      filtered = filtered.filter((order) =>
        order.phone?.toLowerCase().includes(phone.toLowerCase())
      );
    }

    if (itemTitle.trim()) {
      filtered = filtered.filter((order) =>
        order.cart_items.some((item) =>
          item.title?.toLowerCase().includes(itemTitle.toLowerCase())
        )
      );
    }

    if (status === "completed") {
      filtered = filtered.filter((order) => order.isCompleted === true);
    } else if (status === "pending") {
      filtered = filtered.filter((order) => order.isCompleted === false);
    }

    onFilter(filtered);
  }, [firstname, phone, itemTitle, status, orders, onFilter,dateRange]);

  return (
    <Paper p="md" mb="md">
      <Group grow mb="sm">
        <TextInput
          variant="filled"
          radius="xl"
          label="Customer Name"
          placeholder="Search by first name"
          value={firstname}
          onChange={(event) => setFirstname(event.currentTarget.value)}
        />
        <TextInput
          variant="filled"
          radius="xl"
          label="Phone"
          placeholder="Search by phone"
          value={phone}
          onChange={(event) => setPhone(event.currentTarget.value)}
        />
        <Select
          variant="filled"
          radius="xl"
          label="Status"
          placeholder="Select status"
          value={status}
          onChange={setStatus}
          data={[
            { value: "", label: "All" },
            { value: "pending", label: "Pending" },
            { value: "completed", label: "Completed" },
          ]}
          clearable
        />
        <TextInput
          variant="filled"
          radius="xl"
          label="Item Title"
          placeholder="Search by item name"
          value={itemTitle}
          onChange={(event) => setItemTitle(event.currentTarget.value)}
        />
      </Group>
    </Paper>
  );
}

export default OrderFilters;
