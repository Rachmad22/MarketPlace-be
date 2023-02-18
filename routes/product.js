const router = require("express").Router();
const {
  getAddressById,
  getAddressByUserId,
} = require("../controllers/AddressController");
const {
  getAll,
  getProductsById,
  getProductsByUserId,
} = require("../controllers/ProductController");
const {
  tokenValidate,
  //   accessAuthValidate,
} = require("../middlewares/tokenValidation");

router.get("/", getAll);
router.get("/:id", tokenValidate, getProductsById);
router.get("/users/:userId", tokenValidate, getProductsByUserId);

module.exports = router;
