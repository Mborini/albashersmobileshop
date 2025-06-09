"use client";

import React, { useEffect, useState } from "react";
import { Table, ScrollArea, Paper } from "@mantine/core";
import { completeOrder, declineOrder } from "./services/orders";
import ConfirmDeclineModal from "./ConfirmDeclineModal";
import OrderFilters from "./OrderFilters";
import OrderRow from "./OrderRow";

function OrderTable({ orders }) {
  const [orderList, setOrderList] = useState(orders);
  const [filteredOrders, setFilteredOrders] = useState(orders);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  // تحديث البيانات لوصلتها تتغير
  useEffect(() => {
    setOrderList(orders);
    setFilteredOrders(orders);
  }, [orders]);

  const handleComplete = async (orderId) => {
    try {
      await completeOrder(orderId);
      const updatedOrders = orderList.map((order) =>
        order.id === orderId
          ? { ...order, isCompleted: !order.isCompleted }
          : order
      );
      setOrderList(updatedOrders);
      setFilteredOrders(updatedOrders); // حدث الفلترة بعد التحديث
    } catch (error) {
      console.error("Failed to complete order:", error);
    }
  };

  const handleDecline = async () => {
    if (!selectedOrderId) return;
    try {
      await declineOrder(selectedOrderId);
      const updatedOrders = orderList.map((order) =>
        order.id === selectedOrderId ? { ...order, isdeclined: true } : order
      );
      setOrderList(updatedOrders);
      setFilteredOrders(updatedOrders); // حدث الفلترة بعد التحديث
      setModalOpen(false);
      setSelectedOrderId(null);
    } catch (error) {
      console.error("Failed to decline order:", error);
    }
  };

  return (
    <>
      <OrderFilters orders={orderList} onFilter={setFilteredOrders} />
      <Paper shadow="xs" radius="md" withBorder p="md" w="100%">
        <ScrollArea>
          <Table striped highlightOnHover withColumnBorders>
            <thead>
              <tr>
                <th>ID</th>
                <th>Customer</th>
                <th>More</th>
                <th>Items</th>
                <th>Total</th>
                <th>Date</th>
                <th>Status</th>
                <th>Action</th>
                <th>Decline</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <OrderRow
                  key={order.id}
                  order={order}
                  onComplete={handleComplete}
                  onDecline={() => {
                    setSelectedOrderId(order.id);
                    setModalOpen(true);
                  }}
                />
              ))}
            </tbody>
          </Table>
        </ScrollArea>
        <ConfirmDeclineModal
          opened={modalOpen}
          onClose={() => setModalOpen(false)}
          onConfirm={handleDecline}
        />
      </Paper>
    </>
  );
}

export default OrderTable;
