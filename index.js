const express = require("express");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const categoryRoutes = require("./routes/category");
const addressRoutes = require("./routes/address");
const productRoutes = require("./routes/product");
const orderRoutes = require("./routes/order");
const paymentRoutes = require("./routes/payment");
const checkoutRoutes = require("./routes/checkout");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
const cors = require("cors");
const app = express();
const port = 3007;

// default options
// app.use(fileUpload());

// use middleware for grant access upload
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// use cors
app.use(cors());

// Endpoint Auth
app.use("/auth", authRoutes);

// Endpoint User
app.use("/users", userRoutes);

// Endpoint Category
app.use("/categories", categoryRoutes);

// Endpoint Address
app.use("/addresses", addressRoutes);

// Endpoint Product
app.use("/products", productRoutes);

// Endpoint Order
app.use("/Orders", orderRoutes);

// Endpoint Payment
app.use("/payments", paymentRoutes);

// Endpoint Checkouts
app.use("/checkouts", checkoutRoutes);

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
