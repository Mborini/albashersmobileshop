"use client";

import React, { useEffect, useState } from "react";
import { Table, ScrollArea, Paper } from "@mantine/core";
import { completeOrder, declineOrder, sendDeleveryEmail } from "./services/orders";
import ConfirmModal from "./ConfirmModal";
import OrderFilters from "./OrderFilters";
import OrderRow from "./OrderRow";

function OrderTable({ orders }) {
  console.log(orders);
  const [orderList, setOrderList] = useState(orders);
  const [filteredOrders, setFilteredOrders] = useState(orders);

  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const [declineModalOpen, setDeclineModalOpen] = useState(false);
  const [completeModalOpen, setCompleteModalOpen] = useState(false);

  useEffect(() => {
    setOrderList(orders);
    setFilteredOrders(orders);
  }, [orders]);

  const handleComplete = async () => {
    console.log(selectedOrderId)
    if (!selectedOrderId) return;
    try {
      await completeOrder(selectedOrderId);
      await sendDeleveryEmail(selectedOrder); // ✅ pass full order data
      const updatedOrders = orderList.map((order) =>
        order.id === selectedOrderId
          ? { ...order, isCompleted: !order.isCompleted }
          : order
      );
      setOrderList(updatedOrders);
      setFilteredOrders(updatedOrders);
      setSelectedOrderId(null);
      setSelectedOrder(null);
      setCompleteModalOpen(false);
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
      setFilteredOrders(updatedOrders);
      setSelectedOrderId(null);
      setDeclineModalOpen(false);
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
                  onComplete={() => {
                    setSelectedOrderId(order.id);
                    setSelectedOrder(order); // ✅ Save full order
                    setCompleteModalOpen(true);
                  }}
                  onDecline={() => {
                    setSelectedOrderId(order.id);
                    setDeclineModalOpen(true);
                  }}
                />
              ))}
            </tbody>
          </Table>
        </ScrollArea>

        {/* Confirm Complete/Pending */}
        <ConfirmModal
          opened={completeModalOpen}
          onClose={() => setCompleteModalOpen(false)}
          onConfirm={handleComplete}
          title={
            selectedOrder?.isCompleted
              ? "Mark Order as Pending"
              : "Complete the Order"
          }
          message={
            selectedOrder?.isCompleted
              ? "Are you sure you want to mark this order as pending?"
              : "Are you sure you want to mark this order as complete?"
          }
        />

        {/* Confirm Decline */}
        <ConfirmModal
          opened={declineModalOpen}
          onClose={() => setDeclineModalOpen(false)}
          onConfirm={handleDecline}
          title="Confirm Decline"
          message="Are you sure you want to decline this order?"
        />
      </Paper>
    </>
  );
}

export default OrderTable;
