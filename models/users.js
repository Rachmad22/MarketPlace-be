const db = require("../database/index");

const updatedAt = new Date();
// const createdAt = new Date();

const create = async (params) => {
  const { role, name, email, phone_number, store_name, password } = params;

  // sql insert data
  return await db`INSERT INTO users (name, email, phone_number, store_name, password, role) VALUES(${name},${email},${phone_number},${store_name},${password},${role})`;
};

const getUserByEmail = async (email) => {
  return await db`SELECT * FROM users WHERE email=${email}`;
};

const getUserById = async (id) => {
  return await db`SELECT * FROM users WHERE id=${id}`;
};

const getAll = async () => {
  return await db`SELECT * FROM users`;
};

const update = async (params) => {
  const {
    id,
    name,
    email,
    password,
    phone_number,
    store_name,
    role,
    date_of_birth,
    gender,
    photo,
  } = params;
  return await db`UPDATE users SET "name"= ${name}, "email"= ${email}, "phone_number"= ${phone_number}, "store_name"= ${store_name}, "password"= ${password}, "role"= ${role}, "photo"= ${photo}, "date_of_birth"= ${date_of_birth}, "gender"= ${gender}, "updated_at"= ${updatedAt} WHERE id=${id} RETURNING *`;
};

const destroy = async (user_id) => {
  return await db`DELETE FROM users WHERE id=${user_id}`;
};

module.exports = {
  create,
  getUserByEmail,
  getAll,
  getUserById,
  destroy,
  update,
};
