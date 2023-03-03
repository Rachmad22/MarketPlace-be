const {
  create,
  destroy,
  getOrderByUserId,
  updateQty,
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
router.post("/qty/:id/:type", tokenValidate, updateQty);
router.delete("/delete/:id", tokenValidate, destroy);

module.exports = router;
