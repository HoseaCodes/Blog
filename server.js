require('dotenv').config()
const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const bodyParser = require("body-parser");
const articleRouter = require('./routes/articles');
const uploadRouter = require('./routes/upload');
const userRouter = require('./routes/user.js');
require('./config/db');

const app = express();
app.use(logger('dev'));
app.use(express.json());
app.use(cors());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(fileUpload({
    useTempFiles: true
}));

// Configure both serve-favicon & static middlewares
// to serve from the production 'build' folder
app.use(favicon(path.join(__dirname, 'build', 'favicon.ico')));
app.use(express.static(path.join(__dirname, 'build')));

// Put API routes here, before the "catch all" route
app.use('/api', articleRouter);
app.use('/api', uploadRouter);
app.use('/api/user', userRouter);

// The following "catch all" route (note the *)is necessary
// for a SPA's client-side routing to properly work
app.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Configure to use port 3001 instead of 3000 during
// development to avoid collision with React's dev server
const port = process.env.PORT || 3001;

app.listen(port, function () {
    console.log(`Express app running on port: ${port}`)
});
