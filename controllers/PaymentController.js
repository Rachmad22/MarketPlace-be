const payments = require("../models/payment");
const { decodeJwtToken } = require("../utils/jwtToken");

const getByUserId = async (req, res) => {
  const { userId } = req.params;
  const data = await payments.getPaymentByUserId(userId);
  if (data?.length < 1) {
    res.status(200).json({
      status: true,
      message: "Data doesnt exist!",
      total: 0,
      data: [],
    });
  }

  res.status(200).json({
    status: true,
    message: "Success",
    total: data?.length,
    data: data,
  });
};

const create = async (req, res) => {
  try {
    const {
      type_payment,
      address_id,
      cost,
      shipping_cost,
      status,
      no_transaction,
      item_checkouts = [],
    } = req.body;
    const { authorization } = req.headers;

    const decodedToken = await decodeJwtToken(authorization);
    if (!decodedToken) throw { statusCode: 400, message: "Token Error!" };

    // check user
    const user_id = decodedToken?.data?.id;
    const checkUser = await users.getUserById(user_id);
    if (checkUser.length < 1)
      throw { statusCode: 400, message: "User not found!" };

    // create payment
    const createPayment = await payments.create({
      type_payment,
      address_id,
      cost,
      shipping_cost,
      status,
      no_transaction,
      user_id,
      item_checkouts,
    });

    res.status(201).json({
      status: true,
      message: "Data is successfully created!",
      data: createData,
    });
  } catch (error) {
    console.log(error);
    res.status(error?.statusCode ?? 500).json({
      status: false,
      message: error?.message ?? error,
    });
  }
};

module.exports = { create, getByUserId };
