const router = require("express").Router();

const controller = require("../controllers/projectController");
const { requireAuth, requireAdmin } = require("../middleware/auth");

router.get("/stats", controller.stats);
router.get("/", controller.list);

router.patch(
  "/:id/status",
  requireAuth,
  requireAdmin,
  controller.updateStatus
);
router.get("/pending", requireAuth, requireAdmin, controller.pending);

router.get("/:id", controller.details);

router.post("/", requireAuth, controller.create);

module.exports = router;
