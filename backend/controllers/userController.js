const userModel = require("../models/userModel");

async function me(req, res, next) {
  try {
    const user = await userModel.findPublicById(req.auth.sub);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }
    res.json({ success: true, user });
  } catch (error) {
    next(error);
  }
}

module.exports = { me };
