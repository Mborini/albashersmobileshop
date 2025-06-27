import { Modal, Button, Text } from "@mantine/core";

function ConfirmModal({ opened, onClose, onConfirm, title, message }) {
  return (
    <Modal opened={opened} onClose={onClose} title={title} centered>
      <Text mb="md">{message}</Text>
      <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.5rem" }}>
        <Button variant="default" onClick={onClose}>
          Cancel
        </Button>
        <Button color="green" onClick={onConfirm}>
          Confirm
        </Button>
      </div>
    </Modal>
  );
}

export default ConfirmModal;
