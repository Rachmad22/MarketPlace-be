const products = require("../models/product");
const { decodeJwtToken } = require("../utils/jwtToken");

const getAll = async (req, res) => {
  try {
    const data = await products.getAll();
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

const getProductsByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const data = await products.getProductsByUserId(userId);

    if (data.length < 1) {
      throw { statusCode: 400, message: "Data doesnt exist!" };
    }

    res.status(200).json({
      status: true,
      message: "Success",
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

const getProductsById = async (req, res) => {
  try {
    const { authorization } = req.headers;
    const { id } = req.params;
    const data = await products.getProductsById(id);

    // const decodedToken = await decodeJwtToken(authorization);

    // if (!decodedToken) throw { statusCode: 400, message: "Token Error!" };

    // const user_id = decodedToken?.data?.id;

    // if (user_id !== data?.[0]?.user_id)
    //   throw { statusCode: 400, message: "You dont have access for this data!" };

    if (data.length < 1)
      throw { statusCode: 400, message: "Data doesnt exist!" };

    res.status(200).json({
      status: true,
      message: "Success",
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

module.exports = { getAll, getProductsByUserId, getProductsById };
