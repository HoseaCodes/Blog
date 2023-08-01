import mongoose from 'mongoose';

const connectDB =  async () => {
  const URI = process.env.MONGODB_URL || "mongodb://localhost:27017/" 
  mongoose.connect(URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }, err => {
    if (err) {
          throw err;
        } 
        console.log('Connected to MongoDB')
    });  
}

export default connectDB;
