const router = require("express").Router();

const controller = require("../controllers/userController");
const { requireAuth } = require("../middleware/auth");

router.get("/me", requireAuth, controller.me);

module.exports = router;
