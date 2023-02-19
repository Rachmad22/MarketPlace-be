const {
  create,
  destroy,
  getOrderByUserId,
} = require("../controllers/OrderController");
const {
  tokenValidate,
  accessAuthValidate,
} = require("../middlewares/tokenValidation");

const router = require("express").Router();

router.get(
  "/users/:userId",
  tokenValidate,
  accessAuthValidate,
  getOrderByUserId
);
router.post("/", tokenValidate, create);
router.delete("/delete/:id", tokenValidate, destroy);

module.exports = router;
