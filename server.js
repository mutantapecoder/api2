const express       = require('express');
const bodyParser    = require('body-parser');
const mongoose      = require('mongoose');
const morgan        = require('morgan');
const PORT          = process.env.PORT || 5001;
const connectDB     = require('./config/db.js');

const userRoutes     = require('./routes/api/users.js');
const profileRoutes  = require('./routes/api/profile.js');
const postsRoutes    = require('./routes/api/posts.js');
const authRoutes     = require('./routes/api/auth.js')

const app           = express();

connectDB();

//middleware

app.use(morgan('tiny'));

//can use just this one line below instead of using bodyparser explicitly, as body parser functionality now included within express.
// app.use(express.json({ extended: false }))

//or use body parser
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// home route

app.get('/', (req, res) => {
    res.send("API Running")
})

//define routes

app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/profiles', profileRoutes);
app.use('/api/posts', postsRoutes);

app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`)
});



