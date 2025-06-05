"use client";
import React, { useEffect, useState } from "react";
import {
  Table,
  ScrollArea,
  Paper,
  Badge,
  Popover,
  Button,
  Text,
  Group,
} from "@mantine/core";
import dayjs from "dayjs";
import { FaInfo } from "react-icons/fa";
import { completeOrder } from "./services/orders";

function OrderTable({ orders }) {
  const [openedPopoverId, setOpenedPopoverId] = useState(null);
  const [orderList, setOrderList] = useState(orders);

  useEffect(() => {
    setOrderList(orders);
  }, [orders]);
  const handleComplete = async (orderId) => {
    try {
      await completeOrder(orderId); // نفذ تحديث على السيرفر
      setOrderList((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId
            ? { ...order, isCompleted: !order.isCompleted } // عكس الحالة محليًا
            : order
        )
      );
    } catch (error) {
      console.error("Failed to update order:", error);
    }
  };
  
  const rows = orderList.map((order) => (
    <Table.Tr key={order.id}>
      <Table.Td>{order.id}</Table.Td>
      <Table.Td>{`${order.firstname}`}</Table.Td>
      <Table.Td>
        <Popover
          width={250}
          position="top"
          withArrow
          shadow="md"
          opened={openedPopoverId === order.id}
          onClose={() => setOpenedPopoverId(null)}
        >
          <Popover.Target>
            <Button
              variant="subtle"
              size="xs"
              leftSection={<FaInfo size={16} />}
              onClick={() =>
                setOpenedPopoverId((prev) =>
                  prev === order.id ? null : order.id
                )
              }
            >
              Info
            </Button>
          </Popover.Target>
          <Popover.Dropdown>
            <Text size="sm">
              <strong>Name:</strong> {order.firstname}
              <br />
              <strong>Last Name:</strong> {order.lastname}
              <br />
              <strong>Email:</strong> {order.email}
              <br />
              <strong>Phone:</strong> {order.phone}
              <br />
              <strong>Address:</strong> {order.address}
              <br />
              <strong>Country:</strong> {order.country}
              <br />
              <strong>City:</strong> {order.city}
            </Text>
          </Popover.Dropdown>
        </Popover>
      </Table.Td>
      <Table.Td>
        {order.cart_items.length > 0 ? (
          <Group gap={4}>
            <div>
              <Text size="sm" fw={500}>
                {order.cart_items[0].title}
              </Text>
              <Text size="xs" c="dimmed">
                Qty: {order.cart_items[0].quantity} | Price:{" "}
                {order.cart_items[0].discountedPrice} JOD
              </Text>
            </div>
            {order.cart_items.length > 1 && (
              <Popover width={250} position="bottom" withArrow shadow="md">
                <Popover.Target>
                  <Button variant="light" size="xs" ml="xs">
                    +{order.cart_items.length - 1} more
                  </Button>
                </Popover.Target>
                <Popover.Dropdown>
                  {order.cart_items.slice(1).map((item, index) => (
                    <div key={index} style={{ marginBottom: 8 }}>
                      <Text size="sm" fw={500}>
                        {item.title}
                      </Text>
                      <Text size="xs" c="dimmed">
                        Qty: {item.quantity} | Price: {item.discountedPrice} JOD
                      </Text>
                    </div>
                  ))}
                </Popover.Dropdown>
              </Popover>
            )}
          </Group>
        ) : (
          <Text size="sm" c="dimmed">
            No items
          </Text>
        )}
      </Table.Td>

      <Table.Td>{order.total_price} JOD</Table.Td>
      <Table.Td>{dayjs(order.created_at).format("YYYY-MM-DD HH:mm")}</Table.Td>

      <Table.Td>
        <Badge color={order.isCompleted ? "green" : "yellow"}>
          {order.isCompleted ? "complete" : "pending"}
        </Badge>
      </Table.Td>

      <Table.Td>
        <Group gap={4}>
          <Button
            size="xs"
            color={order.isCompleted ? "yellow" : "green"}
            variant="light"
            onClick={() => handleComplete(order.id)}
          >
            {order.isCompleted ? "Mark Pending" : "Complete"}
          </Button>
        </Group>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <Paper shadow="xs" radius="md" withBorder p="md" w="100%">
      <ScrollArea>
        <Table striped highlightOnHover withColumnBorders>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>ID</Table.Th>
              <Table.Th>Customer</Table.Th>
              <Table.Th>More</Table.Th>
              <Table.Th>Items</Table.Th>
              <Table.Th>Total</Table.Th>
              <Table.Th>Date</Table.Th>
              <Table.Th>Status</Table.Th>
              <Table.Th>Action</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>
      </ScrollArea>
    </Paper>
  );
}

export default OrderTable;
