import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  name:{
        type:String,
        required: "this field is required"
    }
});


const Category = mongoose.model('Category', categorySchema);


export default Category;
