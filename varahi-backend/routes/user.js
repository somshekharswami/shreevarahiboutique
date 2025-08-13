const User = require("../models/Users");
const express = require("express");

const router = express.Router();

// POST /api/users
router.post("/", async (req, res) => {
  const { uid, name, email, photoURL } = req.body;

  if (!uid || !email || !name) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const existingUser = await User.findOne({ uid });

    if (existingUser) {
      return res.status(200).json({
        message: "User already exists",
        user: existingUser,
      });
    }

    const newUser = new User({ uid, name, email, photoURL });
    await newUser.save();

    return res.status(201).json({
      message: "User created",
      user: newUser,
    });
  } catch (err) {
    console.error("Error saving user:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
