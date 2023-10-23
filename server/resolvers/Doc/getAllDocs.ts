export const getAllDocs = async()=>{
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
}