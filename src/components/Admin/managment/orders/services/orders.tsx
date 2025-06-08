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
  