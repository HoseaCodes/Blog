import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
  try {
    const URI = process.env.MONGODB_URL || "mongodb://localhost:27017/";
    await mongoose.connect(URI);
    
    // Maintain v5 behavior in v6+
    mongoose.set('strictQuery', false);
    
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('MongoDB Connection Error:', err);
    throw err;
  }
}

export default connectDB;
