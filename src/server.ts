//* when use TS on the backend, use ES6 style imports
import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import axios from 'axios';
import session from 'express-session';
import mongoose from 'mongoose';
import passport from './config/ppConfig';


const app = express();
app.use(express.static(__dirname + '/../client/build/'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.set('view engine', 'ejs');

// The mongoose connection string needs to be typed as string
mongoose.connect(process.env.MONGOOB_URI as string)
const db = mongoose.connection;
// COnnection types don't seem to support db.host and db.port
db.once('open', () => {
  console.log('Connected to mongo');
})

db.on('eeror', (err) => {
  console.log('An error occured: ', err);
})

// Configure the express-session middleware
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true
}))

// Configure the passport middleware
app.use(passport.initialize());
app.use(passport.session()); 

import authRouter from './routes/auth';
import apiRouter from './routes/api';
app.use('/auth', authRouter);
app.use('/api', apiRouter);

app.get('*', (req, res) => {
  // res.redirect('/');
  res.sendFile(__dirname + '/../client/build/index.html');
})

//* proxy won't work with OAuth. We will run react and express at 3000.
app.listen(process.env.PORT || 3000)