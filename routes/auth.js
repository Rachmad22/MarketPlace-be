const router = require("express").Router();
const { register } = require("../controllers/auth/RegisterController");
const { validateRegister } = require("../middlewares/auth/registerValidation");

// register
router.post("/register", validateRegister, register);

module.exports = router;
