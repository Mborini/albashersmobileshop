import pool from "@/app/lib/db";

export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  const body = await req.json();

  const data = {
    title: body.name,
    image_Url: body.image,
    price: body.price,
    discounted_Price: body.discounted_Price,
    description: body.description,
  };
  try {
    const client = await pool.connect();
    const result = await client.query(
      'UPDATE "Ads_Images" SET title = $1, "image_Url" = $2, price = $3, "discounted_Price" = $4, description = $5 WHERE id = $6 RETURNING *',
      [
        data.title,
        data.image_Url,
        data.price,
        data.discounted_Price,
        data.description,
        id,
      ]
    );
    client.release();
    return new Response(JSON.stringify(result.rows[0]), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Update Error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to update ad image" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
