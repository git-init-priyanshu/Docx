const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const User = require("../models/users");

const router = express.Router();

// Signup
router.post("/save-user-details", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });

    if (user)
      return res.json({
        success: false,
        error: "Looks like you already have an account",
      });

    // Encrypting Password
    const salt = await bcrypt.genSalt(Number(process.env.SALT));
    const encryptedPassword = await bcrypt.hash(password, salt);

    // Todo: Confirm email

    const newUser = await User.create({
      email,
      password: encryptedPassword,
      docs: [],
    });

    // Auth Token
    const data = {
      user: {
        id: newUser._id,
      },
    };
    const authToken = jwt.sign(data, process.env.JWT_SECRET);

    res.json({ success: true, authToken });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      error: "Internal Server Error",
    });
  }
});

// Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user)
      return res.status(401).json({
        success: false,
        error: "Invalid credentials",
      });

    // Password validation
    const isCorrectPassword = await bcrypt.compare(password, user.password);
    if (!isCorrectPassword)
      return res.status(401).json({
        success: false,
        error: "Invalid credentials",
      });

    // Auth Token
    const data = {
      user: {
        id: user._id,
      },
    };
    const authToken = jwt.sign(data, process.env.JWT_SECRET);

    res.json({ success: true, authToken });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "Internal Server Error",
    });
  }
});

module.exports = router;
