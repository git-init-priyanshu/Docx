const express = require("express");
const router = express.Router();

const Doc = require("../models/doc");
const User = require("../models/users");

// Get all docs
router.post("/get-all-docs", async (req, res) => {
  const { email, authToken } = req.body;

  try {
    const docs = await Doc.find({ email });
    res.json({ docs });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "Internal Server Error",
    });
  }
});

// Create doc
router.post("/create-doc", async (req, res) => {
  const { newDocId, email } = req.body;
  try {
    Doc.create({
      docId: newDocId,
      email,
      data: { data: "" },
      thumbnail: "",
    });

    res.json({ success: true });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "Internal Server Error",
    });
  }
});

// Save doc thumbnail
router.post("/saveDocThumbnail", async (req, res) => {
  try {
    const { docId, thumbnail } = req.body;

    await Doc.findOneAndUpdate({ docId }, { thumbnail });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "Internal Server Error",
    });
  }
});

module.exports = router;
