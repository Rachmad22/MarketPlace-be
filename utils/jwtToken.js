require("dotenv").config();
const jwt = require("jsonwebtoken");

const decodeJwtToken = async (authorization) => {
  try {
    let token = "";
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

        if (Date.now() >= decoded.exp * 1000) {
          throw {
            statusCode: 401,
            message: "Token expired!",
          };
        }

        token = decoded;
      }
    );

    return token;
  } catch (error) {
    return false;
  }
};

module.exports = { decodeJwtToken };
