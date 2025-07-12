import pool from "@/app/lib/db";

export async function POST(req) {
  try {
    const body = await req.json();
    const {
      firstName,
      lastName,
      email,
      address,
      country,
      note,
      cartItems,
      totalPrice,
      city,
      phone,
      deliveryPrice,
      paymentMethod,
      grandTotal, // أضف هذا هنا
      discountAmount, // أضف هذا هنا
      promoCode, // إذا كنت تستخدم رمز ترويجي
        } = body;
console.log("Received data:", body);
    const client = await pool.connect();
    const result = await client.query(
      `
      INSERT INTO checkouts (
        firstName, lastName, email, address, country, note,
        cart_items, total_price, delivery_price, created_at,
        "isCompleted", city, phone, isdeclined, payment_method,
        grand_total, discount_amount, promoCode
      )
      VALUES (
        $1, $2, $3, $4, $5, $6,
        $7, $8, $9, NOW(),
        false, $10, $11, false, $12,
        $13, $14, $15
      )
      RETURNING *;
      `,
      [
        firstName,
        lastName,
        email,
        address,
        country,
        note,
        JSON.stringify(cartItems),
        totalPrice,
        deliveryPrice,
        city,
        phone,
        paymentMethod , // أضف هذا هنا أيضاً
        grandTotal, // أضف هذا هنا
        discountAmount, // أضف هذا هنا
        promoCode, // إذا كنت تستخدم رمز ترويجي
      ]
    );

    client.release();

    return new Response(JSON.stringify(result.rows[0]), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("POST Error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
