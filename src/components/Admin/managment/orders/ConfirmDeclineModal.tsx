// ConfirmDeclineModal.jsx
"use client";
import { Modal, Button, Text } from "@mantine/core";

export default function ConfirmDeclineModal({ opened, onClose, onConfirm }) {
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Confirm Decline"
      centered
    >
      <Text>Are you sure you want to decline this order?</Text>
      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 16 }}>
        <Button variant="default" onClick={onClose} mr="sm">
          Cancel
        </Button>
        <Button color="red" onClick={onConfirm}>
          Decline
        </Button>
      </div>
    </Modal>
  );
}
