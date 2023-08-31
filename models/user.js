import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  username: {
    type: String,
  },
  aboutMe: {
    type: String,
  },
  projects: {
    type: [String],
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
  },
  avatar: {
    type: Object,
    required: true,
    default: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT0k6I8WItSjK0JTttL3FwACOA6yugI29xvLw&usqp=CAU",
  },
  work : {
    type: [String],
  },
  title: {
    type: String,
    trim: true
  },
  phone : {
    type: String,
    trim: true
  },
  education : {
    type: [String],
  },
  skills : {
    type: [String],
    default: []
  },
  socialMedia : {
    type: [String],
  },
  socialMediaHandles: {
    type: Map,
    of: String
  },
  websites : {
    type: [String],
  },
  location : {
    type: String,
    trim: true
  },
  role: {
    type: Number,
    default: 0
  },
  articles: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Articles'
  }],
  cart: {
    type: Array,
    default: []
  }
}, {
  timestamps: true
}, { strict: false })


const Users = mongoose.model('Users', userSchema);
// Users.createIndexes();

export default Users;
