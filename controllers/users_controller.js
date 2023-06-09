const User = require("../models/user");
const Friendship = require("../models/friendship");

// let's keep it same as before
module.exports.profile = async function (req, res) {
  User.findById(req.params.id, async function (err, user) {
    user = await user.populate("friendships").execPopulate();

    if (req.user.id == user.id) {
      return res.render("user_profile", {
        title: "User Profile",
        profile_user: user,
        friends: Friendship,
      });
    } else {
      const toOtherUser = await Friendship.findOne({
        from_user: req.user.id,
        to_user: user.id,
      });

      const toThisUser = await Friendship.findOne({
        from_user: user.id,
        to_user: req.user.id,
      });

      console.log("toOtherUser ---------------->  " + toOtherUser);
      console.log("toThisUser -----------------> " + toThisUser);

      return res.render("user_profile", {
        title: "User Profile",
        profile_user: user,
        isFriend: toOtherUser || toThisUser,
      });
    }
  });
};

// module.exports.update = function(req, res){
//     if(req.user.id == req.params.id){
//         User.findByIdAndUpdate(req.params.id, req.body, function(err, user){
//             req.flash('success', 'Updated!');
//             return res.redirect('back');
//         });
//     }else{
//         req.flash('error', 'Unauthorized!');
//         return res.status(401).send('Unauthorized');
//     }
// }

module.exports.update = async function (req, res) {
  if (req.user.id == req.params.id) {
    try {
      //find the user
      let user = await User.findById(req.params.id);
      //req body params mutipart
      User.uploadedAvatar(req, res, function (err) {
        if (err) {
          console.log("********** Multer Error", err);
        }

        // console.log('**************** ' + req.file.originalname);
        user.name = req.body.name;
        user.email = req.body.email;

        console.log("------->" + req.body.email);

        if (req.file) {
          //it is saving in path avatar
          for (var a in req.file) {
            console.log("------>" + a, req.file[a]);
          }
          user.avatar = User.avatarUserPath + "/" + req.file.filename;
          console.log("******************** user av ", user.avatar);
        }

        user.save();
        return res.redirect("back");
      });
    } catch (err) {
      req.flash("error", err);
      return res.redirect("back");
    }
  } else {
    req.flash("error", "Unauthorized!");
    return res.status(401).send("Unauthorized");
  }
};

// render the sign up page
module.exports.signUp = function (req, res) {
  if (req.isAuthenticated()) {
    return res.redirect("/users/profile");
  }

  return res.render("user_sign_up", {
    title: "Codeial | Sign Up",
  });
};

// render the sign in page
module.exports.signIn = function (req, res) {
  if (req.isAuthenticated()) {
    return res.redirect("/users/profile");
  }
  return res.render("user_sign_in", {
    title: "Codeial | Sign In",
  });
};

// get the sign up data
module.exports.create = function (req, res) {
  if (req.body.password != req.body.confirm_password) {
    req.flash("error", "Passwords do not match");
    return res.redirect("back");
  }

  User.findOne({ email: req.body.email }, function (err, user) {
    if (err) {
      req.flash("error", err);
      return;
    }

    if (!user) {
      User.create(req.body, function (err, user) {
        if (err) {
          req.flash("error", err);
          return;
        }

        return res.redirect("/users/sign-in");
      });
    } else {
      req.flash("success", "You have signed up, login to continue!");
      return res.redirect("back");
    }
  });
};

// sign in and create a session for the user
module.exports.createSession = function (req, res) {
  req.flash("success", "Logged in Successfully");
  return res.redirect("/");
};

module.exports.destroySession = function (req, res) {
  req.logout(function (err) {
    if (err) {
      // Handle any error that occurs during logout
      console.log(err); // You can log the error or handle it in an appropriate way
    }
  });
  req.flash("success", "You have logged out!");

  return res.redirect("/");
};

module.exports.addFriend = async function (req, res) {
  try {
    console.log("user friend ---------------->" + req.user._id, req.params.id);
    let friendShip = {
      from_user: req.user._id,
      to_user: req.params.id,
    };

    console.log("FriendShip ------>", friendShip.to_user);
    let newFriendShip = await Friendship.create(friendShip);

    console.log("new FriendShip -------> ", newFriendShip.to_user);
    await User.findOne({ email: req.user.email }, function (err, user) {
      if (err) {
        console.log("Error in creating User", err);
      }
      user.friendships.push(newFriendShip);
      user.save();
    });

    if (req.xhr) {
      return res.status(200).json({
        message: "operation done",
        data: {
          done: true,
        },
      });
    }

    res.redirect("back");
  } catch (err) {
    console.log("Error in creating friendship");
  }
};

module.exports.removeFriend = async function (req, res) {
  try {
    let fromUser = req.query.fromID;
    let toUser = req.query.toID;

    let friend = await Friendship.findOne({
      from_user: fromUser,
      to_user: toUser,
    });
    let friendShip = await Friendship.findById(friend._id);
    friendShip.remove();

    console.log("fromuser friendid " + fromUser + " " + friend._id);

    let user = await User.findByIdAndUpdate(fromUser, {
      $pull: { friendships: friend._id },
    });
    console.log("user is ------------->", user);

    if (req.xhr) {
      return res.status(200).json({
        message: "Friend Removed",
      });
    }

    return res.redirect("back");
  } catch (err) {
    console.log("Erro in deletinf friend", err);
    return res.redirect("back");
  }
};
