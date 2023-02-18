require("dotenv").config();
const jwt = require("jsonwebtoken");

const accessAdminValidate = async (req, res, next) => {
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

          if (parseInt(decoded?.data?.role) !== parseInt(2)) {
            throw {
              statusCode: 401,
              message: "Only admin have access for this data!",
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

module.exports = { accessAdminValidate };
