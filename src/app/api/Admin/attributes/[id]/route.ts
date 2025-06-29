import { NextRequest, NextResponse } from "next/server";
import pool from "@/app/lib/db";

type ParamsType = {
  params: { id: string };
};
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const client = await pool.connect();
    const result = await client.query(
      "SELECT id, name, input_type FROM attributes WHERE subcategory_id = $1 ORDER BY id ASC;",
      [id]
    );
    client.release();

    return new Response(JSON.stringify(result.rows), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("DB Error (GET):", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}



// ✅ PUT
export async function PUT(
  req: NextRequest,
  { params }: ParamsType
) {
  try {
    const { id: subcategoryId } = params;
    const { attributes } = await req.json();

    if (!Array.isArray(attributes)) {
      return NextResponse.json(
        { error: "Attributes must be an array" },
        { status: 400 }
      );
    }

    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      await client.query("DELETE FROM attributes WHERE subcategory_id = $1", [
        subcategoryId,
      ]);

      for (const attr of attributes) {
        const { id, name, input_type } = attr;
        await client.query(
          `INSERT INTO attributes (id, subcategory_id, name, input_type)
           VALUES ($1, $2, $3, $4)`,
          [id, subcategoryId, name, input_type]
        );
      }

      await client.query("COMMIT");
    } catch (e) {
      await client.query("ROLLBACK");
      throw e;
    } finally {
      client.release();
    }

    return NextResponse.json(
      { message: "Attributes updated successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("DB Error (PUT):", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// ✅ POST
export async function POST(
  req: NextRequest,
  { params }: ParamsType
) {
  try {
    const { id: subcategoryId } = params;
    const { name, input_type } = await req.json();

    if (!name || !input_type) {
      return NextResponse.json(
        { error: "name and input_type are required" },
        { status: 400 }
      );
    }

    const client = await pool.connect();
    try {
      await client.query(
        `INSERT INTO attributes (name, input_type, subcategory_id) VALUES ($1, $2, $3)`,
        [name, input_type, subcategoryId]
      );
      return NextResponse.json(
        { message: "Attribute added successfully" },
        { status: 201 }
      );
    } finally {
      client.release();
    }
  } catch (error: any) {
    console.error("DB Error (POST):", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
