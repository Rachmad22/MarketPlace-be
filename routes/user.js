const router = require("express").Router();
const user = require("../controllers/UserController");
const { validateUpdate } = require("../middlewares/user/userValidation");

// all users
router.get("/", user.getAll);

// detail users
router.get("/:id", user.getById);

// update
router.patch("/update/:id", user.update);

// delete
router.delete("/delete/:id", user.destroy);

module.exports = router;
