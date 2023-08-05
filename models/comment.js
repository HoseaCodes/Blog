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
    avatar: {
        type: Object,
        default: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT0k6I8WItSjK0JTttL3FwACOA6yugI29xvLw&usqp=CAU"
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
