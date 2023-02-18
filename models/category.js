const db = require("../database/index");

const updatedAt = new Date();
// const createdAt = new Date();

const create = async ({ category_name, category_image, category_color }) => {
  return await db`INSERT INTO categories (category_name, category_image, category_color) VALUES(${category_name},${category_image},${category_color})`;
};

const getCategoryById = async (id) => {
  return await db`SELECT * FROM categories WHERE id=${id}`;
};

const getCategoryByName = async (keyword) => {
  return await db`SELECT * FROM categories WHERE category_name ILIKE ${
    "%" + keyword + "%"
  }`;
};

const getAll = async () => {
  return await db`SELECT * FROM categories`;
};

const update = async ({
  id,
  category_name,
  category_image,
  category_color,
}) => {
  return await db`UPDATE categories SET "category_name"=${category_name}, "category_image"=${category_image}, "category_color"=${category_color}, "updated_at"= ${updatedAt} WHERE id=${id} RETURNING *`;
};

const destroy = async (category_id) => {
  return await db`DELETE FROM categories WHERE id=${category_id}`;
};

module.exports = {
  create,
  getCategoryById,
  getAll,
  getCategoryByName,
  update,
  destroy,
};
