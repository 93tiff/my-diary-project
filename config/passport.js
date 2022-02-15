const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20");
const User = require("../models/user-model");
const LocalStrategy = require("passport-local");
const bcrypt = require("bcrypt");

passport.serializeUser((user, done) => {
  console.log("serializing user now.");
  done(null, user._id); //user後面加底線是因為不論是使用google login or local login，最後mongoDB都會將資料存進去，並將每一筆資料夾上id
});

//用cookie來找user id的部分
passport.deserializeUser((_id, done) => {
  console.log("serializaing id now.");
  User.findById({ _id }).then((user) => {
    console.log("found user.");
    done(null, user);
  });
});

//LocalStrategy
passport.use(
  new LocalStrategy((username, password, done) => {
    console.log(username, password);
    User.findOne({ email: username })
      .then(async (user) => {
        //回傳user資料,看他的email是否等於username
        if (!user) {
          //如果使用者不存在，return done, false代表沒有要認證使用者
          return done(null, false);
        }
        //若使用者存在，使用bcrypt比較輸入的密碼跟資料庫找到的user密碼（已加密）
        await bcrypt.compare(password, user.password, function (err, result) {
          if (err) {
            return done(null, false);
          }
          if (!result) {
            //如果result是false
            return done(null, false);
          } else {
            return done(null, user);
          }
        });
      })
      .catch((err) => {
        return done(null, false);
      });
  })
);

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/redirect",
    },
    (acessToken, refreshToken, profile, done) => {
      //passport callback
      console.log(profile);
      User.findOne({ googleID: profile.id }).then((founduser) => {
        if (founduser) {
          //如果使用者已存在於資料庫的狀況
          console.log("User already exist.");
          done(null, founduser);
        } else {
          //若沒有這個使用者(找不到時會回傳null)則自己做一份copy並存起來
          new User({
            name: profile.displayName,
            googleID: profile.id,
            thumbnail: profile.photos[0].value,
            email: profile.emails[0].value,
          })
            .save()
            .then((newUser) => {
              console.log("New user has been saved.");
              done(null, newUser);
            });
        }
      });
    }
  )
);
