import mongoose from 'mongoose';

const connectDB =  async () => {
  const URI = process.env.MONGODB_URL
  mongoose.connect(URI, {
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true
  }, err => {
      if (err) throw err;
      console.log('Connected to MongoDB')
  });
}

export default connectDB;
