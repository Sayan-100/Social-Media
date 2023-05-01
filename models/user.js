const mongoose = require("mongoose");
const multer = require("multer"); //users at a different place different for
//different
const path = require("path");
const AVATAR_USER_PATH = path.join("/uploads/users/avatars"); //the pictures will be here

const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        avatar: {
            type: String, //we are storing the path to database
        },

        friendships : [
            {
                type : mongoose.Schema.Types.ObjectId,
                ref : 'Friendship'
            }
        ]
    },
    {
        timestamps: true,
    }
);

let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, "..", AVATAR_USER_PATH));
    },

    filename: function (req, file, cb) {
        // file name will be save
        //file.fieldname = avatar-Date.now();
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, file.fieldname + "-" + uniqueSuffix);
    },
});

//statics
userSchema.statics.uploadedAvatar = multer({ storage: storage }).single(
    "avatar"
); // only one file in avatar
userSchema.statics.avatarUserPath = AVATAR_USER_PATH;

const User = mongoose.model("User", userSchema);

module.exports = User;
