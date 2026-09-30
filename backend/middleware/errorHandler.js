module.exports = (err, req, res, next) => {
  console.error(err);

  if (err.message === "CORS origin not allowed") {
    return res.status(403).json({ success: false, message: err.message });
  }

  res.status(err.status || 500).json({
    success: false,
    message: err.expose ? err.message : "Internal server error."
  });
};
