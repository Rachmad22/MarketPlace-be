const express = require("express");
const authRoutes = require("./routes/auth");
const bodyParser = require("body-parser");
const app = express();
const port = 3007;

app.use(bodyParser.json());

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
