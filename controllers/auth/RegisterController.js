const register = async (req, res) => {
  res.status(200).json({
    message: "berhasil register!",
  });
};

module.exports = { register };
