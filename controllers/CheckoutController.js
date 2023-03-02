const checkouts = require("../models/checkouts");

const getByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const data = await checkouts.getByUserId(userId);

    if (data.length < 1) {
      res.status(200).json({
        status: true,
        message: "Data doesnt exist!",
        total: 0,
        data: [],
      });
    } else {
      res.status(200).json({
        status: true,
        message: "Success",
        total: data?.length,
        data: data,
      });
    }
  } catch (error) {
    res.status(error?.statusCode ?? 500).json({
      status: false,
      message: error?.message ?? error,
      data: [],
    });
  }
};

module.exports = { getByUserId };
