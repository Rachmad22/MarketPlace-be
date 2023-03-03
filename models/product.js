const db = require("../database/index");

const updatedAt = new Date();

const getAll = async () => {
  return await db`SELECT products.*, categories.id as category_id, categories.category_name as category_name,  users.store_name as store_name,
  (
    SELECT COALESCE(json_agg(row_to_json(product_images.*)), '[]'::json) 
    FROM product_images 
    WHERE products.id = product_images.product_id
  ) as product_images
  FROM products LEFT JOIN users ON products.user_id=users.id LEFT JOIN categories ON products.category_id=categories.id`;
};

const getProductsById = async (id) => {
  return await db`SELECT products.*, categories.id as category_id, categories.category_name as category_name, users.store_name as store_name, 
  (
    SELECT COALESCE(json_agg(row_to_json(product_images.*)), '[]'::json) 
    FROM product_images 
    WHERE products.id = product_images.product_id
  ) as product_images
  FROM products LEFT JOIN users ON products.user_id=users.id LEFT JOIN categories ON products.category_id=categories.id WHERE products.id=${id}`;
};

const getProductsByUserId = async (user_id) => {
  return await db`SELECT products.*, categories.id as category_id, categories.category_name as category_name, users.store_name as store_name,
  (
    SELECT COALESCE(json_agg(row_to_json(product_images.*)), '[]'::json) 
    FROM product_images 
    WHERE products.id = product_images.product_id
  ) as product_images 
  FROM products LEFT JOIN users ON products.user_id=users.id LEFT JOIN categories ON products.category_id=categories.id WHERE products.user_id=${user_id}`;
  // return await db`SELECT products.*,users.store_name as store_name FROM products LEFT JOIN users ON products.user_id=users.id `;
};

const getProductByCategoryId = async (category_id) => {
  return await db`SELECT products.*, categories.id as category_id, categories.category_name as category_name, users.store_name as store_name,
  (
    SELECT COALESCE(json_agg(row_to_json(product_images.*)), '[]'::json) 
    FROM product_images 
    WHERE products.id = product_images.product_id
  ) as product_images 
  FROM products LEFT JOIN users ON products.user_id=users.id LEFT JOIN categories ON products.category_id=categories.id WHERE category_id=${category_id}`;
};

const search = async (params) => {
  const { keyword, limit, page, sort } = params;
  return await db`SELECT products.*, categories.id as category_id, categories.category_name as category_name, users.store_name as store_name,
  (
    SELECT COALESCE(json_agg(row_to_json(product_images.*)), '[]'::json) 
    FROM product_images 
    WHERE products.id = product_images.product_id
  ) as product_images 
  FROM products LEFT JOIN users ON products.user_id=users.id LEFT JOIN categories ON products.category_id=categories.id WHERE products.product_name ILIKE ${
    "%" + keyword + "%"
  } ORDER BY products.id DESC LIMIT ${limit ?? null} OFFSET ${
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
  getProductByCategoryId,
};
