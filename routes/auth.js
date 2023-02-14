const router = require("express").Router();
const { register } = require("../controllers/auth/RegisterController");

// register
router.post("/register", register);

module.exports = router;
