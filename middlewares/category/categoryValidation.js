require("dotenv").config();
const { Validator } = require("node-input-validator");

const validateCreate = async (req, res, next) => {
  const rules = new Validator(req.body, {
    category_name: "required|minLength:3",
    category_color: "required|minLength:3",
  });

  rules.check().then((matched) => {
    if (matched) {
      next();
    } else {
      res.status(400).json({
        status: false,
        message:
          rules.errors?.category_name?.message ??
          rules.errors?.category_color?.message,
        data: [],
      });
    }
  });
};

module.exports = { validateCreate };
