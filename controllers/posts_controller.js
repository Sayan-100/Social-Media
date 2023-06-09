const Post = require('../models/post');
const Comment = require('../models/comment');
const Like = require('../models/like');


module.exports.create = async function (req, res) {
    try {
        // let post = await Post.create({
        //     content: req.body.content,
        //     user: req.user._id
        // })

        // post = await post.populate('user').execPopulate();

        // if (req.xhr){
        //     return res.status(200).json({
        //         data: {
        //             post: post
        //         },
        //         message: "Post created!"
        //     });
        // }

        // req.flash('success', 'Post published!');
        // return res.redirect('back');

        var myAvatar;
        var postContent;
        var postUser; 

        Post.uploadedAvatar(req, res, async function (err) {
            console.log('***************** Executed');
            if (err) {
                console.log('****************** Error Post', err);
            }
            console.log('---------------------> post controller file is ' + req.file)
            let post = await Post.create({
                content: req.body.content,
                user: req.user._id,
                avatar: undefined
            })

            if(req.file)
            {
                post.avatar =  Post.avatarPostPath + "/" + req.file.filename;
            }
    
            post.save();
    
            post = await post.populate('user').execPopulate();
            post.save();
            if (req.xhr) {
                return res.status(200).json({
                    data: {
                        post: post
                    },
                    message: "Post created!"
                });
            }
            req.flash('success', 'Post published!');
            return res.redirect('back');          
        })

        console.log('---------------> post controller '  + postContent, postUser, myAvatar);

     

    } catch (err) {
        req.flash('error', err);
        return res.redirect('back');
    }

}


module.exports.destroy = async function (req, res) {

    try {
        let post = await Post.findById(req.params.id);

        if (post.user == req.user.id) {

            await Like.deleteMany({likeable : post._id, onModel : 'Post'});
            await Like.deleteMany({_id : {$in : post.comments}});

            post.remove();

            await Comment.deleteMany({ post: req.params.id });

            if (req.xhr) {
                return res.status(200).json({
                    data: {
                        post_id: req.params.id
                    },
                    message: "Post deleted"
                });
            }

            req.flash('success', 'Post and associated comments deleted!');

            return res.redirect('back');
        } else {
            req.flash('error', 'You cannot delete this post!');
            return res.redirect('back');
        }

    } catch (err) {
        req.flash('error', err);
        return res.redirect('back');
    }

}