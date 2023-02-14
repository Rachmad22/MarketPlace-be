const db = require("../database/index");

const updatedAt = new Date();
const createdAt = new Date();

const create = async (params) => {
  const { role, name, email, phone_number, store_name, password } = params;

  // sql insert data
  return await db`INSERT INTO users (name, email, phone_number, store_name, password, role) VALUES(${name},${email},${phone_number},${store_name},${password},${role})`;
};

const getUserByEmail = async (email) => {
  return await db`SELECT * FROM users WHERE email=${email}`;
};

module.exports = { create, getUserByEmail };
