const db = require("../database/index");

const updatedAt = new Date();

const getAll = async () => {
  return await db`SELECT * FROM products`;
};

const getProductsById = async (id) => {
  return await db`SELECT * FROM products WHERE id=${id}`;
};

const getProductsByUserId = async (user_id) => {
  return await db`SELECT * FROM products WHERE user_id=${user_id}`;
};

module.exports = { getAll, getProductsById, getProductsByUserId };
