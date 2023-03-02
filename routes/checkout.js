const router = require("express").Router();
const { getByUserId } = require("../controllers/CheckoutController");
const {
  tokenValidate,
  accessAuthValidate,
} = require("../middlewares/tokenValidation");

router.get("/users/:userId", tokenValidate, accessAuthValidate, getByUserId);

module.exports = router;
