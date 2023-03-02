const db = require("../database/index");

const getAll = async () => {
  return await db`SELECT payments.*, 
  (
    SELECT COALESCE(json_agg(row_to_json(checkouts.*)), '[]'::json) 
    FROM checkouts 
    WHERE payments.id = checkouts.payment_id
  ) as checkouts
FROM payments`;
};

const getPaymentByUserId = async (userId) => {
  return await db`SELECT payments.*, 
    (
      SELECT COALESCE(json_agg(row_to_json(checkouts.*)), '[]'::json)
        FROM checkouts 
        WHERE payments.id = checkouts.payment_id
    ) as checkouts
  FROM payments
  WHERE payments.user_id=${userId}
  ORDER BY updated_at DESC`;
};

const create = async (params) => {
  const {
    type_payment,
    address_id,
    cost,
    shipping_cost,
    status,
    no_transaction,
    user_id,
    item_checkouts = [],
  } = params;

  if (item_checkouts?.length > 0) {
    await db`INSERT INTO product_images ${db(
      item_checkouts,
      "payment_id",
      "product_id",
      "qty",
      "price"
    )}`;
  }

  return await db`INSERT INTO payments (type_payment,
    address_id,
    cost,
    shipping_cost,
    status,
    no_transaction,
    user_id) VALUES(${type_payment}, ${address_id}, ${cost}, ${shipping_cost}, ${status}, ${no_transaction}, ${user_id}) RETURNING *`;
};

module.exports = { getAll, create, getPaymentByUserId };
