import pool from '../../../../../lib/db';

export async function PUT(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const body = await req.json();
    const { attributes, subCategoryId } = body;


    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      // 1. Update product subcategory
      const updateProductSubCategoryQuery = `
        UPDATE products SET subcategory_id = $1 WHERE id = $2
      `;
      await client.query(updateProductSubCategoryQuery, [subCategoryId, id]);

      // 2. Delete existing attributes
      const deleteProductAttrQuery = `
        DELETE FROM product_attributes WHERE product_id = $1
      `;
      await client.query(deleteProductAttrQuery, [id]);

      // 3. Insert new attributes
      const insertProductAttrQuery = `
        INSERT INTO product_attributes (product_id, attribute_id, value)
        VALUES ($1, $2, $3)
      `;

      for (const [attributeId, value] of Object.entries(attributes)) {
        await client.query(insertProductAttrQuery, [id, attributeId, value]);
      }

      await client.query('COMMIT');

      return new Response(JSON.stringify({ success: true, message: 'Product updated' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });

    } catch (error) {
      await client.query('ROLLBACK');
      console.error("Error updating product:", error);
      return new Response(JSON.stringify({ error: 'Failed to update product' }), { status: 500 });
    } finally {
      client.release();
    }
  } catch (err) {
    console.error("Request error:", err);
    return new Response(JSON.stringify({ error: 'Invalid request' }), { status: 400 });
  }
}
