const { Validator } = require("node-input-validator");

const validateLogin = async (req, res, next) => {
  const rules = new Validator(req.body, {
    email: "required|email|maxLength:50",
    password: "required|minLength:8",
  });

  rules.check().then((matched) => {
    if (matched) {
      next();
    } else {
      res.status(400).json({
        status: false,
        message:
          rules.errors?.email?.message ?? rules.errors?.password?.message,
        data: [],
      });
    }
  });
};

module.exports = { validateLogin };
