const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const InstagramStrategy = require('passport-instagram').Strategy;
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const users = require('../users/userEntity');
const configAuth = require('../config/auth');
// passport.use(new LocalStrategy(function(username, password, cb) {
// /* eslint-disable*/
//  users.findOne({'username': username}, function(err, user) {
//  /* eslint-enable*/
//    if (err) { return cb(err); }
//    if (!user) {return cb(null, false); }
//    if (user.password !== password) {return cb(null, false); }
//    return cb(null, user);
//  });
// }));

passport.serializeUser(function(user, done) {
 done(null, user);
});

passport.deserializeUser(function(id, done) {
users.findById(id, function(err, user) {
 done(err, user);
});
});

// Log in Via Application
passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    }, function(req, email, password, done) {
        process.nextTick(function() {
            users.findOne({
                email: email
            }, function(err, user) {
                if (err) {
                    return done(err);
                } else if (!user) {
                    const error = new Error('Your Email ID is not registered');
                    error.name = 'You have not Registered Yet! Please Sign Up first';
                    return done(err);
                } else if (user.authType === 'google' || user.authType === 'facebook' ||
                 user.authType === 'instagram') {
                    const error = new Error('Email ID Is Already Exist via Google Or Facebook');
                    error.name = 'Please Login with ' + user.authType;
                    /* eslint-disable */
                    return done(error.name);
                }
                else if (!user.validPassword(password)) {
                    console.log(user);
                    const error = new Error('Incorrect password');
                    error.name = 'Please enter correct password!';
                    return done(error.name);
                } else {
                    let userData = {};
                    userData._id = user._id;
                    userData.email = user.email;
                    userData.name = user.name;
                    userData.authType = user.authType;
                    userData.localType = user.localType;
                    userData.photos = user.photos;
                    users.findOne({
                        email: userData.email
                    }, function(err0, user) {
                        if (err0) {
                        } else {
                            user.loggedinStatus = true;
                            user.save(function(err1)
                            {
                                if(err1)
                                {
                                    console.log(err1);
                                }
                            });
                        }
                    });
                    return done(null, userData);
                }
                /* eslint-enable*/
            });
        });
    }));
/*eslint-disable */


passport.use(new GoogleStrategy({
    clientID: configAuth.googleAuth.clientID,
    clientSecret: configAuth.googleAuth.clientSecret,
    callbackURL: configAuth.googleAuth.callbackURL,
    passReqToCallback: true
},
/* eslint-disable*/
function(req, token, refreshToken, profile, done) {
/* eslint-enable*/
    // asynchronous
    // console.log(profile);
    process.nextTick(function() {
        // check if the user is already logged in
        if (!req.user) {
            /* eslint-disable*/
            users.findOne({ 'email' : (profile.emails[0].value || '').toLowerCase() }, function(err, user) {
            /* eslint-enable*/
            if (err)
                    return done(err);

                // if the user is found, then log them in
                if (user) {
                            user.loggedinStatus = true;
                            user.save(function(err1)
                            {
                                if(err1)
                                {
                                    console.log(err1);
                                }
                            });
                    return done(null, user); // user found, return that user
                } else {
                    // if there is no user found with that google email, create them
                   var newUser = new users();
                        /*eslint-enable */
                    newUser.id = profile.id;
                    newUser.token = token;
                    newUser.email = (profile.emails[0].value || '').toLowerCase();
                    newUser.name =
                    profile.displayName.toLowerCase().capitalize();
                    newUser.photos = profile.photos[0].value;
                    newUser.authType = 'google';
                    newUser.isnew = 'Y';
                    newUser.loggedinStatus = true;
                    newUser.save(function() {
                        if (err)
                        {
                            return done(err);
                        }
                        return done(null, newUser);
                    });
                }
            });
        }
    });
}));

let fbStrategy = configAuth.facebookAuth;
/*eslint-disable */
    String.prototype.capitalize = function(){
       return this.replace( /(^|\s)([a-z])/g , function(m,p1,p2){return p1+p2.toUpperCase(); });
      };
      /*eslint-enable */
 passport.use(new FacebookStrategy(fbStrategy,

    // facebook will send back the token and profile
    function(token, refreshToken, profile, done) {
        // asynchronous
        process.nextTick(function() {
            // find the user in the database based on their facebook id
            /* eslint-disable */
            users.findOne({ email: (profile.emails[0].value || '').toLowerCase() }, function(err, user) {
                /* eslint-enable */
              // if there is an error, stop everything and return that
                // ie an error connecting to the database
                if (err)
                {
                    return done(err);
                }
                // if the user is found, then log them in
                if (user) {
                            user.loggedinStatus = true;
                            user.save(function(err1)
                            {
                                if(err1)
                                {
                                    // console.log(err1);
                                }
                            });
                    return done(null, user);
                    /*eslint-disable */
                } else {
                    /*  eslint-enable */
                    // if there is no user found with that facebook id, create them
                    /*  eslint-disable */
                    let newUser = new users();
                        /*  eslint-enable */
                    newUser.id = profile.id;
                    newUser.token = token;
                    newUser.email = (profile.emails[0].value || '').toLowerCase();
                    newUser.name =
                    profile.displayName.toLowerCase().capitalize();
                    newUser.photos =
                     'https://graph.facebook.com/' + profile.id + '/picture?width=9999';
                    newUser.authType = 'facebook';
                    newUser.isnew = 'Y';
                    newUser.loggedinStatus = true;
                    newUser.save(function() {
                        if (err)
                        {
                            return done(err);
                        }
                        return done(null, newUser);
                    });
                        }
            });
        return;
        });
    }));

passport.use(new InstagramStrategy({
    clientID: '62be12ccaf0f431a8f8d5fbd150a54d1',
    clientSecret: '274b5123329d4283a7e65751d7b30d63',
    callbackURL: 'http://localhost:8080/users/auth/instagram/callback',
    scopes: ['likes' + 'basic']
  },
  function(accessToken, refreshToken, profile, done) {
        process.nextTick(function() {
        // check if the user is already logged in
            /* eslint-disable*/
            users.findOne({ 'id' : profile.id }, function(err, user) {
            /* eslint-enable*/
            if (err)
            {
                    return done(err);
                }
                /*  eslint-disable */
                // if the user is found, then log them in
                if (user) {
                            user.loggedinStatus = true;
                            user.save(function(err1)
                            {
                                if(err1)
                                {
                                    console.log(err1);
                                }
                            });
                    return done(null, user);
                } else {
                    // if there is no user found with that google id, create them
                    let newUser = new users();
                        /* eslint-enable */
                        // console.log(profile);
                    newUser.id = profile.id;
                    newUser.token = accessToken;
                    newUser.email = profile.username + '@gmail.com';
                    newUser.name =
                    profile.username.toLowerCase().capitalize();
                    newUser.photos = profile.profile_picture;
                    newUser.authType = 'instagram';
                    newUser.isnew = 'Y';
                    newUser.loggedinStatus = true;
                    newUser.save(function() {
                        if (err)
                        {
                            return done(err);
                        }
                        return done(null, newUser);
                    });
                }
            });
    });
    }));


module.exports = passport;
