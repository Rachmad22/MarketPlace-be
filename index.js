const express = require("express");
const authRoutes = require("./routes/auth");
const app = express();
const port = 3007;

// Endpoint Auth
app.use("/auth", authRoutes);

app.use("/", (req, res) => {
  res.json({
    status: true,
    message: "Server running",
    version: "1.0.0",
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
