const router = require("express").Router();
const category = require("../controllers/CategoryController");
const {
  validateCreate,
} = require("../middlewares/category/categoryValidation");
const { tokenValidate } = require("../middlewares/tokenValidation");

router.get("/", category.getAll);
router.get("/:id", category.getById);
router.post("/", tokenValidate, validateCreate, category.create);
router.patch("/update/:id", tokenValidate, category.update);
router.delete("/delete/:id", tokenValidate, category.destroy);

module.exports = router;
