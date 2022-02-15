const express = require("express");
const app = express();
const ejs = require("ejs");
const mongoose = require("mongoose");
require("dotenv").config();
const authRoute = require("./routes/auth-route");
const profileRoute = require("./routes/profile-route");
require("./config/passport");
const passport = require("passport");
const session = require("express-session");
const flash = require("connect-flash");

//連接到mongoose, mongodb
mongoose
  .connect(process.env.DB_CONNECT)
  .then(() => {
    console.log("Connect to MongoDB Atlas");
  })
  .catch((e) => {
    console.log(e);
  });

//middleware
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());
app.use((req, res, next) => {
  res.locals.sucess_msg = req.flash("sucess_msg");
  res.locals.error_msg = req.flash("error_msg");
  //下面是local strategy的失敗訊息會自動被passport送到下面的error
  res.locals.error = req.flash("error");
  next();
});

//google route
app.use("/auth", authRoute);

app.use("/profile", profileRoute);

app.get("/", (req, res) => {
  res.render("index", { user: req.user });
});

app.get("/about", (req, res) => {
  res.render("about", { user: req.user });
});

//設置port數字
const port = process.env.PORT || 80;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
