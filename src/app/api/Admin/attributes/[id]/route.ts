import pool from "@/app/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  contextPromise: Promise<{ params: { id: string } }>
): Promise<Response> {
  try {
    const { params } = await contextPromise;
    const { id } = params;

    const client = await pool.connect();
    const result = await client.query(
      "SELECT id, name,input_type FROM attributes WHERE subcategory_id = $1 ORDER BY id ASC;",
      [id]
    );
    client.release();
    return new Response(JSON.stringify(result.rows), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("DB Error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function PUT(
  req: NextRequest,
  contextPromise: Promise<{ params: { id: string } }>
): Promise<Response> {
  try {
    const { params } = await contextPromise;
    const { id: subcategoryId } = params;

    const body = await req.json();
    const { attributes } = body;

    if (!Array.isArray(attributes)) {
      return new Response(
        JSON.stringify({ error: "Attributes must be an array" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      // نحذف أولاً كل attributes الحالية لهذا subcategory
      await client.query("DELETE FROM attributes WHERE subcategory_id = $1", [
        subcategoryId,
      ]);

      // ثم ندرج البيانات الجديدة
      for (const attr of attributes) {
        const { id, name, input_type } = attr;

        // ممكن تتجنب id لو الـ id auto-generated في الجدول
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

    return new Response(
      JSON.stringify({ message: "Attributes updated successfully" }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    console.error("DB Error:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Internal Server Error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

export async function POST(
  req: NextRequest,
  contextPromise: Promise<{ params: { id: string } }>
) {
  try {
    const { params } = await contextPromise;
    const subcategoryId = params.id;

    const body = await req.json();
    const { name, input_type } = body;

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
  } catch (error) {
    console.error("POST error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
