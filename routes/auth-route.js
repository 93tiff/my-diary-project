const router = require("express").Router();
const passport = require("passport");
const bcrypt = require("bcrypt");
const User = require("../models/user-model");

router.get("/login", (req, res) => {
  res.render("login", { user: req.user });
});

//sign up
router.get("/signup", (req, res) => {
  res.render("signup", { user: req.user });
});

//log out
router.get("/logout", (req, res) => {
  req.logOut(); //passport內建
  res.redirect("/"); //導回首頁
});

//local login
router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/auth/login",
    failureFlash: "Wrong email or password.",
  }),
  (req, res) => {
    if (req.session.returnTo) {
      //如果req.session.returnTo為true，則
      let newPath = req.session.returnTo;
      req.session.returnTo = "";
      res.redirect(newPath);
    } else {
      res.redirect("/profile");
    }
  }
);

router.post("/signup", async (req, res) => {
  console.log(req.body);
  let { name, email, password } = req.body;
  //check if data is already in database
  const emailExist = await User.findOne({ email });
  if (emailExist) {
    req.flash("error_msg", "Email has already been registered.");
    return res.redirect("/auth/signup");
  }
  //如果email不存在，則進行加密密碼
  const hash = await bcrypt.hash(password, 10);
  password = hash;
  let newUser = new User({ name, email, password });
  try {
    await newUser.save();
    req.flash("sucess_msg", "Registeration succeed.");
    res.redirect("/auth/login");
  } catch (err) {
    req.flash("error_msg", err.errors.name.properties.message);
    return res.redirect("/auth/signup");
  }
});

//sign in時接收使用者需求的route
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"], //登入時獲取profile及email
  })
);

//建立sign in後導向其他頁面(profile)
router.get("/google/redirect", passport.authenticate("google"), (req, res) => {
  if (req.session.returnTo) {
    let newPath = req.session.returnTo;
    req.session.returnTo = "";
    res.redirect(newPath);
  } else {
    res.redirect("/profile");
  }
});

module.exports = router;
