const mongoose = require('mongoose');
const likeSchema = new mongoose.Schema({
    user : {
        type : mongoose.Schema.Types.ObjectId
    },

    //Object on which like is placed ->  post / comment
    likeable : { 
        type : mongoose.Schema.Types.ObjectId,
        required : true,
        //dynamic reference
        refPath : 'onModel'
    },

    onModel : {
        type : String,
        required : true,
        enum : ['Post', 'Comment'] //Only post / commment
    }
}, {
    timestamps : true
})

const Like = mongoose.model('Like', likeSchema);
module.exports = Like;