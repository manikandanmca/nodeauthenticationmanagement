var express = require("express");
const mongoose = require('mongoose');
const bodyParser = require("body-parser");
const passport = require("passport");
const app = express();

const users = require('./routes/api/v1/users');
const profile = require('./routes/api/v1/profile');
const posts = require('./routes/api/v1/posts');
// DB config
const db = require('./config/keys').mongoURI;

// Connect to MongoDB
mongoose
.connect(db)
.then(() => console.log('MongoDB Connected'))
.catch((error) => console.log('Error in MongoDB connection',error));


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(passport.initialize());
require('./config/passport')(passport);


app.get('/', (req, res) => res.send('Hello welcome'));
app.use('/api/v1/users', users);
//routes(app);

const port = process.env.PORT || 5000

var server = app.listen(port, function () {
    console.log("app running on port.", server.address().port);
});