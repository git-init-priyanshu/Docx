const express = require("express");
const router = express.Router();

const Doc = require("../models/doc");

router.get("/getAllDocs", async (req, res) => {
  const docs = await Doc.find();
  res.json({ data: docs });
});

router.post("/saveDocThumbnail", async (req, res) => {
  const { docId, thumbnail } = req.body;

  await Doc.findOneAndUpdate({ docId }, { thumbnail });
});

module.exports = router;
