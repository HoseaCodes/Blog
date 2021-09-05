import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
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
    default: "https://i.imgur.com/19i5Whc.png",
  },
  work : {
    type: Array,
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
    type: Array,
  },
  skills : {
    type: Array,
    default: []
  },
  sociallMedia : {
    type: Array,
  },
  websites : {
    type: Array,
  },
  location : {
    type: String,
    trim: true
  },
  role: {
    type: Number,
    default: 0
  },
  cart: {
    type: Array,
    default: []
  }
}, {
  timestamps: true
})


const Users = mongoose.model('Users', userSchema);

Users.createIndexes();

export default Users;
