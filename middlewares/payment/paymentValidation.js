const { Validator } = require("node-input-validator");

const validateCreate = async (req, res, next) => {
  const rules = new Validator(req.body, {
    type_payment: "required|integer",
    address_id: "required|integer",
    cost: "required|integer|between:1,99999999999",
    shipping_cost: "required|integer|between:1,99999999999",
    status: "required|integer",
    item_checkouts: "required|array",
  });

  rules.check().then((matched) => {
    if (matched) {
      next();
    } else {
      res.status(400).json({
        status: false,
        message:
          rules.errors?.type_payment?.message ??
          rules.errors?.address_id?.message ??
          rules.errors?.cost?.message ??
          rules.errors?.shipping_cost?.message ??
          rules.errors?.status?.message ??
          rules.errors?.item_checkouts?.message,
        data: [],
      });
    }
  });
};

module.exports = { validateCreate };
