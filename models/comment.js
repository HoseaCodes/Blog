import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
    name:{
        type:String,
        required: "this field is required"
    },
    email:{
        type:String,
        required: "this field is required"
    },
    comment:{
        type:String,
        required:"this filed is required"
    },
    blog:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'Articles'
    }

},{
    timestamps: true
})

const Comments = mongoose.model('Comments', commentSchema);

export default Comments;
