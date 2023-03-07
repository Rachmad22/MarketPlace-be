const db = require("../database/index");

const create = async (params) => {
  const { product_images } = params;
  return await db`INSERT INTO product_images ${db(
    product_images,
    "product_id",
    "image"
  )}`;
};

const getProductImagesByProductId = async (product_id) => {
  return await db`SELECT * FROM product_images WHERE product_id=${product_id}`;
};

const destroyByProductId = async (product_id) => {
  return await db`DELETE FROM product_images WHERE product_id=${product_id}`;
};

module.exports = { create, getProductImagesByProductId, destroyByProductId };
