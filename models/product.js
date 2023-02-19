const db = require("../database/index");

const updatedAt = new Date();

const getAll = async () => {
  return await db`SELECT products.*, product_images.* FROM products LEFT JOIN product_images ON products.id=product_images.product_id`;
};

const getProductsById = async (id) => {
  return await db`SELECT * FROM products WHERE id=${id}`;
};

const getProductsByUserId = async (user_id) => {
  return await db`SELECT * FROM products WHERE user_id=${user_id}`;
};

const search = async (params) => {
  const { keyword, limit, page } = params;
  return await db`SELECT * FROM products WHERE product_name ILIKE ${
    "%" + keyword + "%"
  } ORDER BY id DESC LIMIT ${limit ?? null} OFFSET ${
    page ? limit * (page - 1) : 0
  }`;
};

const create = async (params) => {
  const {
    user_id,
    category_id,
    category_gender,
    product_name,
    price,
    condition,
    description,
    stock,
    size,
  } = params;

  // sql insert data
  return await db`INSERT INTO products (user_id, category_id, category_gender, product_name, price, condition, description, stock, size) VALUES(${user_id},${category_id},${category_gender},${product_name},${price},${condition},${description},${stock},${size}) RETURNING *`;
};

module.exports = {
  getAll,
  getProductsById,
  getProductsByUserId,
  search,
  create,
};
