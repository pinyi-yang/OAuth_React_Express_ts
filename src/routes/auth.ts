import express from 'express';
const router = express.Router();
import passport from '../config/ppConfig';

// GET /auth/github - displays the GH login page
router.get('/github', passport.authenticate('github'));

// GET /auth/github/callback - call URL that receives the token
router.get('/github/callback', passport.authenticate('github', {failureRedirect: '/auth/login'}), (req, res) => {
  //*Successful authentication
  console.log('👤👤👤this is the user info from db: ', req.user);
  res.render('success', {user: req.user});
});

export default router;

