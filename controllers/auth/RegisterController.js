const db = require("../../database/index");

const register = async (req, res) => {
  try {
    //   role => 0 : "seller", 1 : "Buyer"
    const { role, name, email, phone_number, store_name, password } = req.body;
  } catch (error) {
    console.log(error);
  }

  res.status(200).json({
    message: "berhasil register!",
  });
};

module.exports = { register };
