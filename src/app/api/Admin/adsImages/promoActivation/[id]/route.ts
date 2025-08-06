// /api/Admin/adsImages/[id]/activate/route.ts
import pool from "@/app/lib/db";

export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  const { is_active } = await req.json();

  try {
    const client = await pool.connect();
    const result = await client.query(
      'UPDATE "Ads_Images" SET is_active = $1 WHERE id = $2 RETURNING *',
      [is_active, id]
    );
    client.release();
    return new Response(JSON.stringify(result.rows[0]), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Activation Error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to activate ad image" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
