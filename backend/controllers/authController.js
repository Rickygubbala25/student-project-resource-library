const bcrypt = require("bcrypt");
const userModel = require("../models/userModel");
const { signToken } = require("../utils/jwt");
const { requiredString, validEmail } = require("../middleware/validation");

async function register(req, res, next) {
  try {
    const fullName = requiredString(req.body.fullName, "Full name", 150);
    const email = validEmail(req.body.email);
    const password = requiredString(req.body.password, "Password", 128);

    if (password.length < 8) {
      const error = new Error("Password must be at least 8 characters.");
      error.status = 400;
      error.expose = true;
      throw error;
    }

    const existing = await userModel.findByEmail(email);
    if (existing) {
      return res.status(409).json({ success: false, message: "Email is already registered." });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await userModel.createUser({
      fullName,
      email,
      passwordHash,
      college: req.body.college,
      department: req.body.department,
      semester: req.body.semester,
      studentId: req.body.studentId
    });

    const token = signToken(user);
    res.status(201).json({ success: true, token, user });
  } catch (error) {
    next(error);
  }
}

async function login(req, res, next) {
  try {
    const email = validEmail(req.body.email);
    const password = requiredString(req.body.password, "Password", 128);

    const user = await userModel.findByEmail(email);
    if (!user || !user.is_active) {
      return res.status(401).json({ success: false, message: "Invalid email or password." });
    }

    const matches = await bcrypt.compare(password, user.password_hash);
    if (!matches) {
      return res.status(401).json({ success: false, message: "Invalid email or password." });
    }

    const safeUser = {
      id: user.id,
      full_name: user.full_name,
      email: user.email,
      college: user.college,
      department: user.department,
      semester: user.semester,
      student_id: user.student_id,
      role: user.role,
      is_active: user.is_active,
      created_at: user.created_at
    };

    const token = signToken(safeUser);
    res.json({ success: true, token, user: safeUser });
  } catch (error) {
    next(error);
  }
}

async function me(req, res, next) {
  try {
    const user = await userModel.findPublicById(req.auth.sub);
    if (!user || !user.is_active) {
      return res.status(401).json({ success: false, message: "User account is unavailable." });
    }
    res.json({ success: true, user });
  } catch (error) {
    next(error);
  }
}

module.exports = { register, login, me };
