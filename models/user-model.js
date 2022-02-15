const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required: true,
        minlength: 5,
        maxlength:255,
    },
    googleID:{
        type: String,
    },
    date:{
        type: Date,
        default: Date.now,
    },
    thumbnail:{
        //在google上存的縮圖
        type: String,
    }, 
    //以上為從google獲得的資訊，下面為local login
    email:{
        type:String,
    },
    password:{
        type: String,
        maxlength: 1024, //因為會hash password，所以要設定夠長
        minlength:8,
    },
});

module.exports = mongoose.model("User", userSchema);