const db = require("../database/index");

const updatedAt = new Date();
const createdAt = new Date();

const create = async (params) => {
  const {
    address_alias,
    recipient_name,
    recipient_phone_number,
    street,
    city,
    postal_code,
    is_primary,
    user_id,
  } = params;

  if (is_primary === true) {
    await db`UPDATE addresses SET "is_primary"=FALSE WHERE user_id=${user_id}`;
  }

  // sql insert data
  return await db`INSERT INTO addresses (address_alias,
    recipient_name,
    recipient_phone_number,
    street,
    city,
    postal_code,
    is_primary,
    created_at,
    updated_at,
    user_id) VALUES(${address_alias},${recipient_name},${recipient_phone_number},${street},${city},${postal_code},${is_primary},${createdAt}, ${updatedAt},${user_id} )`;
};

const getAll = async () => {
  return await db`SELECT * FROM addresses`;
};

const getAddressById = async (id) => {
  return await db`SELECT * FROM addresses WHERE id=${id}`;
};

const getAddressByUserId = async (user_id) => {
  return await db`SELECT * FROM addresses WHERE user_id=${user_id}`;
};

const update = async (params) => {
  const {
    id,
    address_alias,
    recipient_name,
    recipient_phone_number,
    street,
    city,
    postal_code,
    is_primary,
  } = params;
  return await db`UPDATE addresses SET "address_alias"= ${address_alias}, "recipient_name"= ${recipient_name}, "recipient_phone_number"= ${recipient_phone_number}, "street"= ${street}, "city"= ${city}, "postal_code"= ${postal_code}, "is_primary"= ${is_primary}, "updated_at"= ${updatedAt} WHERE id=${id} RETURNING *`;
};

const destroyById = async (id) => {
  return await db`DELETE FROM addresses WHERE id=${id}`;
};

const destroyByUserId = async (user_id) => {
  return await db`DELETE FROM addresses WHERE user_id=${user_id}`;
};

module.exports = {
  create,
  getAddressById,
  getAll,
  getAddressByUserId,
  destroyById,
  destroyByUserId,
  update,
};
