const Like = require("../models/like");
const Post = require("../models/post");
const Comment = require("../models/comment");

module.exports.toggleLike = async function (req, res) {
  try {
    //take out the likable post/ comment

    //url -> likes.toggle/?id=abcdef&type=Post

    console.log("toggle like executed here --- > ");
    let likeableObject;
    let deleted = false;

    console.log(req.query.id, req.query.type);

    if (req.query.type == "Post") {
      likeableObject = await Post.findById(req.query.id).populate("likes");
    } else {
      likeableObject = await Comment.findById(req.query.id).populate("likes");
    }

    //check if a like already exists
    let existingLike = await Like.findOne({
      likeable: req.query.id,
      onModel: req.query.type,
      user: req.user._id,
    });

    //delete it
    if (existingLike) {
      likeableObject.likes.pull(existingLike._id);
      likeableObject.save();

      existingLike.remove();
      deleted = true;
    }

    //create like
    else {
      let newLike = await Like.create({
        user: req.user.id,
        likeable: req.query.id,
        onModel: req.query.type,
      });

      likeableObject.likes.push(newLike._id);
      likeableObject.save();
    }

    if (req.xhr) {
      return res.status(200).json({
        message: "Request Successful",
        data: {
          deleted: deleted,
        },
      });
    }

    return res.redirect('back');
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
