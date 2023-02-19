const db = require("../database/index");
// const updatedAt = new Date();

const create = async (params) => {
  const { product_id, qty, size, user_id, total_stock } = params;
  await db`UPDATE products SET "stock"= ${total_stock} WHERE id=${product_id}`;
  return await db`INSERT INTO orders (product_id, qty, size, user_id) VALUES(${product_id}, ${qty}, ${size}, ${user_id}) RETURNING *`;
};

const getOrderById = async (id) => {
  return await db`SELECT * FROM orders WHERE id=${id}`;
};

const getOrderByUserId = async (user_id) => {
  return await db`SELECT * FROM orders WHERE user_id=${user_id}`;
};

const destroy = async (params) => {
  const { id, product_id, total_stock } = params;
  await db`UPDATE products SET "stock"= ${total_stock} WHERE id=${product_id}`;
  return await db`DELETE FROM orders WHERE id=${id}`;
};

module.exports = { create, getOrderById, destroy, getOrderByUserId };
