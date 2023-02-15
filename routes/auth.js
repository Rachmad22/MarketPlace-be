const router = require("express").Router();
const { register } = require("../controllers/auth/RegisterController");
const { login } = require("../controllers/auth/LoginController");
const { validateRegister } = require("../middlewares/auth/registerValidation");
const { validateLogin } = require("../middlewares/auth/loginValidation");

// register
router.post("/register", validateRegister, register);

// login
router.post("/login", validateLogin, login);

module.exports = router;
