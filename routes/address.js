const router = require("express").Router();
const {
  getAll,
  create,
  getAddressById,
  getAddressByUserId,
  destroyById,
  destroyByUserId,
  update,
} = require("../controllers/AddressController");
const { validateCreate } = require("../middlewares/address/addressValidation");
const {
  tokenValidate,
  accessAuthValidate,
} = require("../middlewares/tokenValidation");

router.get("/", tokenValidate, getAll);
router.get("/:id", tokenValidate, getAddressById);
router.get(
  "/users/:userId",
  tokenValidate,
  accessAuthValidate,
  getAddressByUserId
);
router.post("/", tokenValidate, validateCreate, create);
router.patch("/update/:id", tokenValidate, update);
router.delete("/delete/:id", tokenValidate, destroyById);
router.delete(
  "/delete/users/:userId",
  tokenValidate,
  accessAuthValidate,
  destroyByUserId
);

module.exports = router;
