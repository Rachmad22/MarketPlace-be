const products = require("../models/product");
const users = require("../models/users");
const orders = require("../models/order");
const categories = require("../models/category");
const productImages = require("../models/productImage");

const { decodeJwtToken } = require("../utils/jwtToken");

const getOrderByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    const data = await orders.getOrderByUserId(userId);
    if (data?.length < 1) {
      throw { statusCode: 400, message: "Data doesnt exist!" };
    }

    res.status(200).json({
      status: true,
      message: "Success",
      total: data?.length,
      data: data,
    });
  } catch (error) {
    res.status(error?.statusCode ?? 500).json({
      status: false,
      message: error?.message ?? error,
      data: [],
    });
  }
};

const create = async (req, res) => {
  try {
    const { product_id, qty, size } = req.body;
    const { authorization } = req.headers;

    const decodedToken = await decodeJwtToken(authorization);
    if (!decodedToken) throw { statusCode: 400, message: "Token Error!" };

    // check user
    const user_id = decodedToken?.data?.id;
    const checkUser = await users.getUserById(user_id);
    if (checkUser.length < 1)
      throw { statusCode: 400, message: "User not found!" };

    //check product
    const checkProduct = await products.getProductsById(product_id);
    if (checkProduct.length < 1)
      throw { statusCode: 400, message: "Product not found!" };

    if (checkProduct?.[0]?.stock < 1)
      throw { statusCode: 400, message: "Product out of stock!" };

    if (qty > checkProduct?.[0]?.stock)
      throw {
        statusCode: 400,
        message: "Order exceeds the maximum stock limit",
      };

    const total_stock = parseInt(checkProduct?.[0]?.stock) - parseInt(qty);

    // // create product
    const createData = await orders.create({
      product_id,
      qty,
      size,
      user_id,
      total_stock,
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

// delete
const destroy = async (req, res) => {
  try {
    const { id } = req.params;

    const data = await orders.getOrderById(id);

    if (data.length < 1) {
      throw { statusCode: 400, message: "Data doesnt exist!" };
    } else {
      const product = await products.getProductsById(data?.[0]?.product_id);
      // delete data from database
      await orders.destroy({
        id,
        product_id: data?.[0]?.product_id,
        total_stock: parseInt(data?.[0]?.qty) + parseInt(product?.[0]?.stock),
      });
    }

    // return response
    res.status(200).json({
      status: true,
      message: "Data successfully deleted!",
    });
  } catch (error) {
    res.status(error?.statusCode ?? 500).json({
      status: false,
      message: error?.message ?? error,
    });
  }
};

module.exports = {
  create,
  destroy,
  getOrderByUserId,
};
