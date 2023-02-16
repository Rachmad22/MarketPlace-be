const router = require("express").Router();
const user = require("../controllers/UserController");
const { accessAuthValidate } = require("../middlewares/user/userValidation");
const { tokenValidate } = require("../middlewares/tokenValidation");

// all users
router.get("/", user.getAll);

// detail users
router.get("/:id", user.getById);

// update
router.patch("/update/:id", tokenValidate, accessAuthValidate, user.update);

// delete
router.delete("/delete/:id", tokenValidate, accessAuthValidate, user.destroy);

module.exports = router;
