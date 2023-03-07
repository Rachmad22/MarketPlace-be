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

  const data = await db`INSERT INTO payments (type_payment,
    address_id,
    cost,
    shipping_cost,
    status,
    no_transaction,
    user_id) VALUES(${type_payment}, ${address_id}, ${cost}, ${shipping_cost}, ${status}, ${no_transaction}, ${user_id}) RETURNING *`;

  const newItemCheckout = item_checkouts.map((item) => {
    return {
      payment_id: data?.[0].id,
      product_id: item?.product_id,
      qty: item?.qty,
      price: item?.price,
    };
  });

  if (item_checkouts?.length > 0) {
    await db`INSERT INTO checkouts ${db(
      newItemCheckout,
      "payment_id",
      "product_id",
      "qty",
      "price"
    )}`;
  }

  return data;
};

module.exports = { getAll, create, getPaymentByUserId };
