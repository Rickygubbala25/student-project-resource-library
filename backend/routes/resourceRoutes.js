const router = require("express").Router();
const multer = require("multer");

const controller = require("../controllers/resourceController");
const { requireAuth } = require("../middleware/auth");

const upload = multer({
  dest: "uploads/"
});

router.get("/", controller.list);

router.get("/:id", controller.details);

router.post(
  "/upload",
  requireAuth,
  upload.single("file"),
  controller.upload
);

module.exports = router;
