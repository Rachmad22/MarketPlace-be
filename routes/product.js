const router = require("express").Router();

const {
  getAll,
  getProductsById,
  getProductsByUserId,
  search,
  create,
  getProductsByCategoryId,
} = require("../controllers/ProductController");
const { validateCreate } = require("../middlewares/product/productValidation");
const {
  tokenValidate,
  //   accessAuthValidate,
} = require("../middlewares/tokenValidation");

router.get("/", getAll);
router.get("/:id", getProductsById);
router.get("/users/:userId", getProductsByUserId);
router.get("/category/:categoryId", getProductsByCategoryId);
router.get("/search/data", search);
router.post("/", tokenValidate, validateCreate, create);

module.exports = router;
