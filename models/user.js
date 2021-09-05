import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    avatar: {
      type: Object,
      required: true,
      default: "https://i.imgur.com/JSD2auk.png",
    },
    title: {
      type: String,
    },
    work : {
      type: Array,
    },
    education : {
      type: Array,
    },
    skills : {
      type: Array,
      default: []
    },
    phone : {
      type: String
    },
    socailMedia : {
      type: Array,
    },
    websites : {
      type: Array,
    },
    location : {
      type: String,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
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
