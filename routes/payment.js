const router = require("express").Router();
const { getByUserId, create } = require("../controllers/PaymentController");
const {
  tokenValidate,
  accessAuthValidate,
} = require("../middlewares/tokenValidation");

router.get("/users/:userId", tokenValidate, accessAuthValidate, getByUserId);
router.post("/", tokenValidate, create);

module.exports = router;
