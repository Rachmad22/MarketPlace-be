const { Validator } = require("node-input-validator");

const validateRegister = async (req, res, next) => {
  const rules = new Validator(req.body, {
    role: "required|boolean",
    name: "required|minLength:3",
    email: "required|email|maxLength:50",
    phone_number: "required|minLength:9",
    password: "required|regex:[A-Z]+[0-9]|minLength:8",
  });

  rules.check().then((matched) => {
    if (matched) {
      next();
    } else {
      res.status(400).json({
        status: false,
        message:
          rules.errors?.role?.message ??
          rules.errors?.name?.message ??
          rules.errors?.email?.message ??
          rules.errors?.phone_number?.message ??
          rules.errors?.password?.message,
        data: [],
      });
    }
  });
};

module.exports = { validateRegister };
