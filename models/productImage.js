const db = require("../database/index");

const create = async (params) => {
  const { product_images } = params;
  return await db`INSERT INTO product_images ${db(
    product_images,
    "product_id",
    "image"
  )}`;
};

module.exports = { create };
