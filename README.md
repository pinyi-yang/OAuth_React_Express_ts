# OAuth with Node/Express and React (Typescript)

## 1. Project Initiation

### 1.1 Node/Express Backend
Initiate a node/express server as the backend in Typescript:
* a src folder with all .ts files
* a build folder for Typescript compiler
* setup package.json and tsconfig.json
For detailed steps, please refer to [!Typescript Full Stack App: Node/Express, GraphQL and React (Hooks)](https://github.com/shadownova65/ts_express_graphql_react_hook)

### 1.2 Other Modules
To implement OAuth in Node/Express and React, below modules need to be installed as well:
* axios: hit routes and call apis
* passport, express-session, "passport strategy" (this case: passport-github2): to communicate with OAuth for authenticate user and handle token
* mongoose: for database
* ejs: as React is one-page app and losing state when refresh, but OAuth require at least 3 refresh for anthentication. ejs is needed to open a page for authentication while keep the previous React page untouched
And we also need type support for all of these modules (@types/)
```
npm i axios passport express-session passport-github2 mongoose ejs dotenv

npm i @types/axios @types/passport @types/express-session @types/passport-github2 @types/mongoose @types/ejs @types/dotenv
```


## 2. Passport and Session Setup
Passort is a node middleware using the concepts of strategies to authenticate requests. For OAuth, it will help us to get token back. And express-sesssion middleware will stop the token in server and use for further access. To setup, following steps are included:
* setup passport strategies
* apply passport.authenticate to /auth/ route
* setup session and passport for token storage

### 2.1 Passport Strategies
On [!Passportjs](http://www.passportjs.org/) website, there are over 500 strategies for popular websites like Google, Facebook, Twitter and so on. It is very convenient for OAuth. Previous, passport-github2 was installed. It is the passport strategy for Github. In the src, let's make another folder named src/config/, then add ppConfig.ts for passport strategies configuration:
```javascript
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