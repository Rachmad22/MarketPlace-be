const router = require("express").Router();
const { validateCreate } = require("../middlewares/payment/paymentValidation");
const { getByUserId, create } = require("../controllers/PaymentController");
const {
  tokenValidate,
  accessAuthValidate,
} = require("../middlewares/tokenValidation");

router.get("/users/:userId", tokenValidate, accessAuthValidate, getByUserId);
router.post("/", tokenValidate, validateCreate, create);

module.exports = router;
