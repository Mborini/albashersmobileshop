import pool from "../../../lib/db";

export async function GET() {
  let client;
  try {
    client = await pool.connect();
    console.log("Connected to DB");

    const query = `
 SELECT 
        p.id AS product_id,
        p.title AS product_name,
        p.description,
        p.price,
        p."discountedPrice",
        b.name AS brand_name,
        sc.name AS subcategory_name,
        c.name AS category_name,
        a.name AS attribute_name,
        pa.value AS attribute_value
      FROM products p
      LEFT JOIN brands b ON p.brand_id = b.id
      LEFT JOIN "subCategories" sc ON p."subcategory_id" = sc.id
      LEFT JOIN categories c ON sc.category_id = c.id
      LEFT JOIN product_attributes pa ON p.id = pa.product_id
      LEFT JOIN attributes a ON pa.attribute_id = a.id
      ORDER BY p.id;
    `;

    const res = await client.query(query);
    
    return new Response(JSON.stringify(res.rows), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("DB Error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  } finally {
    if (client) client.release();
  }
}



export async function POST(req: Request) {
  const client = await pool.connect();

  try {
    const body = await req.json();
    const {
      title,
      image,
      brand_id,
      subcategory_id,
      description,
      price,
      discountedPrice,
      attributes,
    } = body;

    if (
      !title ||
      !image ||
      !brand_id ||
      !subcategory_id ||
      !description ||
      price == null ||
      discountedPrice == null
    ) {
      return new Response("Missing required fields", { status: 400 });
    }

    await client.query("BEGIN");

    // Insert product using IDs
    const insertProductQuery = `
      INSERT INTO products (
        title, brand_id, subcategory_id,
        description, price, "discountedPrice"
      )
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
    `;

    const productResult = await client.query(insertProductQuery, [
      title,
      brand_id,
      subcategory_id,
      description,
      price,
      discountedPrice,
    ]);

    const product = productResult.rows[0];

    // ✅ Insert image into product_image table
    const insertImageQuery = `
      INSERT INTO product_images (product_id, image_url)
      VALUES ($1, $2);
    `;

    await client.query(insertImageQuery, [product.id, image]);

    // ✅ Insert attributes if provided
    if (Array.isArray(attributes) && attributes.length > 0) {
      const insertAttrQuery = `
        INSERT INTO product_attributes (product_id, attribute_id, value)
        VALUES ($1, $2, $3);
      `;

      for (const attr of attributes) {
        await client.query(insertAttrQuery, [
          product.id,
          attr.attribute_id,
          attr.value,
        ]);
      }
    }

    await client.query("COMMIT");

    return new Response(JSON.stringify(product), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("POST /products error:", error);
    return new Response("Internal Server Error", { status: 500 });
  } finally {
    client.release();
  }
}



