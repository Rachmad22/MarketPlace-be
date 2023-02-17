require("dotenv").config();
const { Validator } = require("node-input-validator");

const validateCreate = async (req, res, next) => {
  const rules = new Validator(req.body, {
    address_alias: "required|minLength:3",
    recipient_name: "required|minLength:3",
    recipient_phone_number: "required|minLength:9",
    street: "required|minLength:10",
    city: "required|minLength:4",
    postal_code: "required|minLength:4",
    is_primary: "required|boolean",
    user_id: "required|integer",
  });

  rules.check().then((matched) => {
    if (matched) {
      next();
    } else {
      res.status(400).json({
        status: false,
        message:
          rules.errors?.address_alias?.message ??
          rules.errors?.recipient_name?.message ??
          rules.errors?.recipient_phone_number?.message ??
          rules.errors?.street?.message ??
          rules.errors?.city?.message ??
          rules.errors?.postal_code?.message ??
          rules.errors?.is_primary?.message ??
          rules.errors?.user_id?.message,
        data: [],
      });
    }
  });
};

module.exports = { validateCreate };
