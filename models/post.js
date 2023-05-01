const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const AVATAR_POST_PATH = path.join('/uploads/posts/avatars');


const postSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    user: {
        type:  mongoose.Schema.Types.ObjectId,
        ref: 'User'

    },
    // include the array of ids of all comments in this post schema itself
    comments: [
        {
            type:  mongoose.Schema.Types.ObjectId,
            ref: 'Comment'
        }
    ],

    likes : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'Like'
        }
    ],

    avatar : {
        type : String
    }
},{
    timestamps: true
});


let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, "..", AVATAR_POST_PATH));
    },

    filename: function (req, file, cb) {
        // file name will be save
        //file.fieldname = avatar-Date.now();
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, file.fieldname + "-" + uniqueSuffix);
    },
});

//statics
postSchema.statics.uploadedAvatar = multer({storage : storage}).single(
    "avatar"
);

postSchema.statics.avatarPostPath = AVATAR_POST_PATH;

const Post = mongoose.model('Post', postSchema);
module.exports = Post;