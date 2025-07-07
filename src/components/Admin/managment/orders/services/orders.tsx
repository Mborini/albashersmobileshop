const API_URL = "/api/Admin/orders";

export async function fetchOrders() {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error("Failed to fetch products");
  return await res.json();
  
}
export const completeOrder = async (orderId) => {
    return fetch(`/api/Admin/orders/${orderId}/complete`, {
      method: 'PUT',
    });
  };
export const declineOrder = async (orderId) => {
  return fetch(`/api/Admin/orders/${orderId}/decline`, {
    method: 'PUT',
  });
}
export const sendDeleveryEmail = async (order) => {
  const res = await fetch("/api/send-delivery-email", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      to: order.email,
      name: order.firstname,
      phone: order.phone,
      totalPrice: Number(order.total_price),
       delivery_price: Number(order.delivery_price) || 0,
       payment_method: order.payment_method,
      country: order.country,
      city: order.city,
      address: order.address,
      note: order.note,
      lang: order.lang || "ar",
    }),
  });

  if (!res.ok) {
    throw new Error("Failed to send delivery email");
  }

  return res.json();
};
