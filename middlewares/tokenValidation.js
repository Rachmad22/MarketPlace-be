require("dotenv").config();
const jwt = require("jsonwebtoken");
const { Validator } = require("node-input-validator");

const tokenValidate = async (req, res, next) => {
  try {
    // get token from header authorization
    const { authorization } = req.headers;
    const { id } = req.params;
    if (authorization) {
      // decode token jwt
      jwt.verify(
        authorization.replace("Bearer ", ""),
        process.env.JWT_KEY,
        (err, decoded) => {
          if (err) {
            throw {
              statusCode: 401,
              message: "Token error, please try again!",
            };
          }

          // if (Date.now() >= decoded.exp * 1000) {
          //   throw {
          //     statusCode: 401,
          //     message: "Token expired!",
          //   };
          // }

          next();
        }
      );
    } else {
      throw { statusCode: 401, message: "No token provide!" };
    }
  } catch (error) {
    res.status(error?.statusCode ?? 500).json({
      status: false,
      message: error?.message ?? error,
      data: [],
    });
  }
};

const accessAuthValidate = async (req, res, next) => {
  try {
    // get token from header authorization
    const { authorization } = req.headers;
    const { id, userId } = req.params;
    if (authorization) {
      // decode token jwt
      jwt.verify(
        authorization.replace("Bearer ", ""),
        process.env.JWT_KEY,
        (err, decoded) => {
          if (err) {
            throw {
              statusCode: 401,
              message: "Token error, please try again!",
            };
          }

          if (parseInt(decoded?.data?.id) !== parseInt(id ?? userId)) {
            throw {
              statusCode: 401,
              message: "You dont have access for this data!",
            };
          }

          next();
        }
      );
    } else {
      throw { statusCode: 401, message: "No token provide!" };
    }
  } catch (error) {
    res.status(error?.statusCode ?? 500).json({
      status: false,
      message: error?.message ?? error,
      data: [],
    });
  }
};

module.exports = { tokenValidate, accessAuthValidate };
