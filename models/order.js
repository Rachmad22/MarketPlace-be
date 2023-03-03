const db = require("../database/index");
const updatedAt = new Date();

const create = async (params) => {
  const { product_id, qty, size, user_id, total_stock } = params;
  await db`UPDATE products SET "stock"= ${total_stock} WHERE id=${product_id}`;
  return await db`INSERT INTO orders (product_id, qty, size, user_id) VALUES(${product_id}, ${qty}, ${size}, ${user_id}) RETURNING *`;
};

const getOrderById = async (id) => {
  return await db`SELECT orders.*, orders.id as orders_id, products.*, products.id as product_id, categories.*, categories.id as category_id, users.store_name as store_name, users.id as store_id,
  (
    SELECT COALESCE(json_agg(row_to_json(product_images.*)), '[]'::json) 
    FROM product_images 
    WHERE products.id = product_images.product_id
  ) as product_images
  FROM orders LEFT JOIN products ON products.id = orders.product_id
  JOIN categories ON categories.id = products.category_id
  JOIN users ON users.id = products.user_id
  WHERE orders.id=${id}
  ORDER BY orders.created_at DESC`;
  // return await db`SELECT * FROM orders WHERE id=${id}`;
};

const getOrderByUserId = async (user_id) => {
  return await db`SELECT orders.*, orders.id as orders_id, products.*, products.id as product_id, categories.*, categories.id as category_id, users.store_name as store_name, users.id as store_id,
  (
    SELECT COALESCE(json_agg(row_to_json(product_images.*)), '[]'::json) 
    FROM product_images 
    WHERE products.id = product_images.product_id
  ) as product_images
  FROM orders LEFT JOIN products ON products.id = orders.product_id
  JOIN categories ON categories.id = products.category_id
  JOIN users ON users.id = products.user_id
  WHERE orders.user_id=${user_id} 
  ORDER BY orders.created_at DESC`;
};

const updateQty = async (params) => {
  const { stock_product, qty, product_id, order_id } = params;
  // change product stock
  await db`UPDATE products SET "stock"= ${stock_product}, "updated_at"= ${updatedAt} WHERE id=${product_id} RETURNING *`;
  // change data order
  return await db`UPDATE orders SET "qty"= ${qty}, "updated_at"= ${updatedAt} WHERE id=${order_id} RETURNING *`;
};

const destroy = async (params) => {
  const { id, product_id, total_stock } = params;
  await db`UPDATE products SET "stock"= ${total_stock} WHERE id=${product_id}`;
  return await db`DELETE FROM orders WHERE id=${id}`;
};

module.exports = { create, getOrderById, destroy, getOrderByUserId, updateQty };
