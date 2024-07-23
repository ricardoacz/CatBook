require('dotenv').config({ path: './config/.env' });
const express = require('express');
//const path = require('path');
const app = express();
const connectDB = require('./config/connectDB')
const catRoutes = require('./routes/catRoutes');
const userRoutes = require('./routes/userRoutes')
const mongoose = require('mongoose')
const session = require('express-session')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const User = require('./models/userModel')


const PORT = process.env.PORT || 3000

connectDB()

app.use(express.urlencoded({ extended: true }));
app.use(express.json())
//app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static('public'));
app.set('view engine', 'ejs');

app.use(session({
  secret: 'cat secret',
  resave: false,
  saveUnitialized: false
}))

app.use(passport.initialize())
app.use(passport.session())

passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

// passing current user info to all routes
app.use((req, res, next) => {
  res.locals.currentUser = req.user
  next()
})

app.use('/', catRoutes);
app.use('/', userRoutes)

mongoose.connection.once('open', () => {
  console.log('Connected to MongoDB')
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
})