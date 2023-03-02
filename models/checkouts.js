const db = require("../database/index");

const getByUserId = async (userId) => {
  return await db`SELECT checkouts.*, checkouts.id as checkout_id, products.*, categories.*, payments.*, payments.created_at as date_payment FROM checkouts,
  (
    SELECT COALESCE(json_agg(row_to_json(product_images.*)), '[]'::json) 
    FROM product_images 
    WHERE products.id = product_images.product_id
  ) as product_images
    LEFT JOIN payments ON payments.id = checkouts.payment_id
  LEFT JOIN products ON products.id = checkouts.product_id
JOIN categories ON categories.id = products.category_id
WHERE payments.user_id = ${userId}
ORDER BY payments.created_at DESC`;
};

module.exports = { getByUserId };
