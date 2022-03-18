import dotenv from 'dotenv';
import express from 'express';
import path from 'path';
import favicon from 'serve-favicon';
import logger from 'morgan';
import fileUpload from 'express-fileupload';
import cors from 'cors';
import bodyParser from "body-parser";
import cookieParser from 'cookie-parser'
import articleRouter from './routes/articles.js';
import uploadRouter from './routes/upload.js';
import paymentRouter from './routes/payment.js';
import productRouter from './routes/product.js';
import userRouter from './routes/user.js';
import connectDB from './config/db.js';
import {imageOp} from './utils/imageOp.js';
import rateLimit from 'express-rate-limit';

dotenv.config();
imageOp();
connectDB()

const app = express();
app.use(logger('dev'));
app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(fileUpload({
    useTempFiles: true
}));

const __dirname = path.resolve(path.dirname(''));
// Configure both serve-favicon & static middlewares
// to serve from the production 'build' folder
app.use(favicon(path.join(__dirname, 'build', 'favicon.ico')));
app.use(express.static(path.join(__dirname, 'build')));
const limiter = rateLimit({
	// windowMs: 15 * 60 * 1000, // 15 minutes
	// max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  windowMs: 60 * 60 * 1000, // 1 hour
	max: 100, // Limit each IP to 100 requests per `window` (here, per 1 hour)
  message:
  'Too many accounts created from this IP, please try again after an hour',
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})

// Apply the rate limiting middleware to all requests
app.use(limiter);

// Put API routes here, before the "catch all" route
app.use('/api', articleRouter);
app.use('/api', uploadRouter);
app.use('/api', paymentRouter);
app.use('/api', productRouter);
app.use('/api/user', userRouter);

// The following "catch all" route (note the *)is necessary
// for a SPA's client-side routing to properly work
app.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Configure to use port 3001 instead of 3000 during
// development to avoid collision with React's dev server
const port = process.env.PORT || 3001;
const startServer = async () => {

  app.listen(port, function () {
      console.log(`Express app running on port: ${port}`)
  });
};

startServer();
