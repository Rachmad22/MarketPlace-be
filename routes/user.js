const router = require("express").Router();
const user = require("../controllers/UserController");
const { tokenValidate } = require("../middlewares/user/userValidation");

// all users
router.get("/", user.getAll);

// detail users
router.get("/:id", user.getById);

// update
router.patch("/update/:id", tokenValidate, user.update);

// delete
router.delete("/delete/:id", tokenValidate, user.destroy);

module.exports = router;
