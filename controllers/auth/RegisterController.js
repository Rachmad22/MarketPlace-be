const bcrypt = require("bcrypt");
const users = require("../../models/users");
const convertData = require("../../utils/convertData");

const register = async (req, res) => {
  try {
    //   role => 0 : "seller", 1 : "Buyer/Customer"
    const { role, name, email, phone_number, store_name, password } = req.body;
    const saltRounds = 10;

    // check email is exist
    const checkEmail = await users.getUserByEmail(email);
    if (checkEmail.length > 0) {
      throw { statusCode: 409, message: "Email is already registered!" };
    }

    // check store name for seller
    if ((role === false || role === "false") && store_name.length < 8) {
      throw { statusCode: 402, message: "Store name min length 8 character!" };
    }

    // convert string to bool
    let newRole = true;
    if (typeof role === "string") {
      newRole = convertData.strToBool(gender);
    } else {
      newRole = role;
    }

    // hash password
    const hash = await bcrypt.hash(password, saltRounds);

    await users.create({
      role: newRole,
      name,
      email,
      phone_number,
      store_name,
      password: hash,
    });

    // return response
    res.status(201).json({
      status: true,
      message: "Register is successfully!",
    });
  } catch (error) {
    res.status(error?.statusCode ?? 500).json({
      status: false,
      message: error?.message ?? error,
      data: [],
    });
  }
};

module.exports = { register };
