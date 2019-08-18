import dotenv from 'dotenv';
dotenv.config();
import passport from 'passport';
import passportGithub2 from 'passport-github2';
const GithubStrategy = passportGithub2.Strategy;
import User from '../models/user';

passport.use(new GithubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_SECRET_ID,
  callbackURL: "http://localhost:3000/auth/github/callback"
}, 
function(accessToken, refreshToken, profile, cb) {
  User.findOne({
    githubId: profile.id
  }, (err, user) => {
    if (!user) {
      //no user, create user and return the user info
      User.create({
        githubId: profile.id
      }, (err, user) => {
        return cb(null, {...user.toObject(), accessToken});
      })
    } else {
      return cb(null, {...user.toObject(), accessToken});
    }

  })
}))

passport.serializeUser(function(user,cb) {
  cb(null, user);
});
passport.deserializeUser(function(obj, cb) {
  cb(null, obj)
})

export default passport;