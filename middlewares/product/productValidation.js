const { Validator } = require("node-input-validator");

const validateCreate = async (req, res, next) => {
  const rules = new Validator(req.body, {
    category_id: "required|integer",
    category_gender: "required|string",
    product_name: "required|string|minLength:5|maxLength:40",
    price: "required|integer|between:1,99999999999",
    condition: "required|boolean",
    description: "required|string|minLength:10",
    stock: "required|integer|between:1,999999",
  });

  rules.check().then((matched) => {
    if (matched) {
      next();
    } else {
      res.status(400).json({
        status: false,
        message:
          rules.errors?.category_id?.message ??
          rules.errors?.category_gender?.message ??
          rules.errors?.product_name?.message ??
          rules.errors?.price?.message ??
          rules.errors?.condition?.message ??
          rules.errors?.description?.message ??
          rules.errors?.stock?.message,
        data: [],
      });
    }
  });
};

module.exports = { validateCreate };
