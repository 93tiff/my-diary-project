const router = require("express").Router();
const Post = require("../models/post-model"); //require post model

//middleware
const authCheck = (req, res, next) => {
  //如果使用者尚未認證過的話，導去登入頁
  if (!req.isAuthenticated()) {
    req.session.returnTo = req.originalUrl;
    res.redirect("/auth/login");
  } else {
    next();
  }
};

router.get("/", authCheck, async (req, res) => {
  let postFound = await Post.find({ author: req.user._id });
  //加入user object，資料就抓資料庫裡req.user內的資料，丟到ejs使用
  //加入postFound，讓找到的post內容可以使用在profile.ejs
  res.render("profile", { user: req.user, posts: postFound });
});

//post
router.get("/post", authCheck, (req, res) => {
  res.render("post", { user: req.user });
});

router.post("/post", authCheck, async (req, res) => {
  let { title, content } = req.body; //title跟conent是在post.ejs裡面的property name
  let newPost = new Post({ title, content, author: req.user._id });
  try {
    await newPost.save();
    res.status(200).redirect("/profile"); //若成功了導向profile頁面
  } catch (err) {
    req.flash("error_meg", "Both tittle and content are required.");
    res.redirect("/profile/post");
  }
});

module.exports = router;
