import React, { useState } from "react";
import { Table, Button, Text, Badge, Group, Popover } from "@mantine/core";
import { FaInfo } from "react-icons/fa";
import dayjs from "dayjs";
import { CiNoWaitingSign } from "react-icons/ci";

function OrderRow({ order, onComplete, onDecline }) {
  const [popoverOpened, setPopoverOpened] = useState(false);
console.log(order);
  const rowStyle = {
    backgroundColor: order.isdeclined
      ? "#f8d7da"
      : order.isCompleted
      ? "#d4edda"
      : "#fff3cd",
    opacity: order.isdeclined ? 0.7 : 1,
  };

  return (
    <Table.Tr key={order.id} style={rowStyle}>
      <Table.Td>{order.id}</Table.Td>
      <Table.Td>{order.firstname}</Table.Td>

      <Table.Td>
        <Popover
          width={250}
          position="top"
          withArrow
          shadow="md"
          opened={popoverOpened}
          onClose={() => setPopoverOpened(false)}
        >
          <Popover.Target>
            <Button
              variant="subtle"
              size="xs"
              leftSection={<FaInfo size={16} />}
              onClick={() => setPopoverOpened((prev) => !prev)}
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
            <div className="space-y-1">
              <Text size="sm" fw={600} className="text-gray-900">
                {order.cart_items[0].title}
              </Text>

              <div className="flex items-center gap-3 text-xs text-gray-500">
                <span>Qty: {order.cart_items[0].quantity}</span>
                <span>
                  | Price:{" "}
                  <span className="font-semibold text-black">
                    {order.cart_items[0].discountedPrice} JD
                  </span>
                </span>

                <span className="flex items-center gap-1">
                  | Color:
                  {order.cart_items[0].color ? (
                    <span
                      style={{ backgroundColor: order.cart_items[0].color }}
                      className="w-4 h-4 rounded-full border border-gray-300 shadow-sm cursor-pointer hover:scale-110 transition-transform"
                    ></span>
                  ) : (
                    <CiNoWaitingSign className="text-gray-400" size={16} />
                  )}
                </span>
              </div>
            </div>

            {order.cart_items.length > 1 && (
              <Popover width={250} position="bottom" withArrow shadow="md">
                <Popover.Target>
                  <Button variant="light" size="xs" ml="xs">
                    +{order.cart_items.length - 1} more
                  </Button>
                </Popover.Target>
                <Popover.Dropdown>
                  {order.cart_items.slice(1).map((item, idx) => (
                    <div key={idx} style={{ marginBottom: 8 }}>
                      <Text size="sm" fw={500}>
                        {item.title}
                      </Text>
                      <Text size="xs" c="dimmed">
                        Qty: {item.quantity} | Price: {item.discountedPrice} JD
                      </Text>
                      <Text size="xs" c="dimmed">
                        Color:{" "}
                        {item.color ? (
                          <span
                            style={{
                              backgroundColor: item.color,
                              display: "inline-block",
                              width: 12,
                              height: 12,
                              borderRadius: "50%",
                            }}
                          ></span>
                        ) : (
                          <CiNoWaitingSign
                            size={16}
                            className="inline-block align-middle text-gray-400"
                          />
                        )}
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

      <Table.Td>{order.total_price} JD</Table.Td>
      <Table.Td>{order.delivery_price ?? 0} JD</Table.Td>
      <Table.Td>
        {(
          Number(order.total_price) + Number(order.delivery_price ?? 0)
        ).toFixed(2)}{" "}
        JD
      </Table.Td>
      <Table.Td>
        {order.payment_method === "cod"
          ? "COD"
          : order.payment_method === "click"
          ? "Click "
          : "Unknown"}
      </Table.Td>
      <Table.Td>{dayjs(order.created_at).format("YYYY-MM-DD HH:mm")}</Table.Td>
      <Table.Td>
        <Badge color={order.isCompleted ? "green" : "yellow"}>
          {order.isCompleted ? "complete" : "pending"}
        </Badge>
      </Table.Td>
      <Table.Td>
        <Button
          size="xs"
          color={
            order.isdeclined ? "gray" : order.isCompleted ? "yellow" : "green"
          }
          variant="light"
          onClick={() => onComplete(order.id)}
          style={{
            pointerEvents: order.isdeclined ? "none" : "auto",
            opacity: order.isdeclined ? 0.5 : 1,
          }}
        >
          {!order.isdeclined
            ? order.isCompleted
              ? "Mark Pending"
              : "Complete"
            : "Declined"}
        </Button>
      </Table.Td>
      <Table.Td>
        <Button
          size="xs"
          color="red"
          variant="light"
          onClick={onDecline}
          disabled={order.isCompleted || order.isdeclined}
        >
          Decline
        </Button>
      </Table.Td>
    </Table.Tr>
  );
}

export default OrderRow;
