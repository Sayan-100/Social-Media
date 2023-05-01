const Post = require("../models/post");
const User = require("../models/user");
const FriendShip = require("../models/friendship");
const { default: locale } = require("antd/lib/date-picker/locale/en_US");

module.exports.home = async function (req, res) {
  try {
    // populate the user of each post
    let posts = await Post.find({})
      .sort("-createdAt")
      .populate("user")
      .populate({
        path: "comments",
        populate: {
          path: "user",
        },
      });

    let users = await User.find({});

    if (req.user) {
      let current_user = await User.findOne({ email: req.user.email })
      .populate({
          path: "friendships",
          populate: {
            path: "to_user",
          },
        }
      );
      
      let allFriends =  await FriendShip.find({to_user : req.user.id}).populate("from_user");
      return res.render("home", {
        title: "Codeial | Home",
        posts: posts,
        all_users: users,
        currentFriends: current_user.friendships,
        toUserFriends : allFriends
      });
    }

    return res.render("home", {
      title: "Codeial | Home",
      posts: posts,
      all_users: users,
    });
  } catch (err) {
    console.log("Error", err);
    return;
  }
};

// module.exports.actionName = function(req, res){}

// using then
// Post.find({}).populate('comments').then(function());

// let posts = Post.find({}).populate('comments').exec();

// posts.then()
