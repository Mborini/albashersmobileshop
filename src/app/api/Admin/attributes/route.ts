import pool from "@/app/lib/db";

export async function GET() {
  try {
    const client = await pool.connect();

    const query = `
      SELECT 
        sc.*,
        attr.id AS attr_id,
        attr.name AS attr_name,
        attr.input_type AS attr_type,
        attr.subcategory_id AS attr_subcategory_id
      FROM "subCategories" sc
      LEFT JOIN attributes attr ON sc.id = attr.subCategory_id
    `;

    const result = await client.query(query);
    client.release();

    return new Response(JSON.stringify(result.rows), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (error: any) {
    console.error("Database query failed in GET /api/your-endpoint:", error);

    return new Response(JSON.stringify({ error: "Internal Server Error", details: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
