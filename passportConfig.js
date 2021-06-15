const User = require("./user");
const bcrypt = require("bcryptjs");
const localStrategy = require("passport-local").Strategy;
const passport = require("passport");
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;


module.exports = function (passport) {
    passport.use(
        new localStrategy((username, password, done) => {
            User.findOne({ username: username }, (err, user) => {
                if (err) throw err;
                if (!user) return done(null, false);
                bcrypt.compare(password, user.password, (err, result) => {
                    if (err) throw err;
                    if (result === true) {
                    return done(null, user);
                } else {
                    return done(null, false);
                }
            });
        });
    }))
    passport.use(new GoogleStrategy({
        clientID: "596773874661-pqh0d3k0rqtt64h4j0lqglo05t2660an.apps.googleusercontent.com",
        clientSecret: "uYnvreyclBsDIZ-brHTaUBkn",
        callbackURL: "/google/callback"
    },
        function (accessToken, refreshToken, profile, done) {
            process.nextTick(function () {
                User.findOne({
                    $or: [
                        { 'google.id': profile.id },
                        { 'email': profile.emails[0].value }
                    ]
                }, function (err, user) {
                    if (err) {
                        return done(err);
                    }
    
                    if (user) {
                        if (user.google.id == undefined) {
                            user.google.id = profile.id;
                            user.google.token = accessToken;
                            user.google.email = profile.emails[0].value;
                            user.google.name = profile.name.givenName + ' ' + profile.name.familyName;
                            user.save();
                        }
    
                        return done(null, user);
    
                    } else {
                        let newUser = new User();
                        newUser.google.id = profile.id;
                        newUser.google.token = accessToken;
                        newUser.google.email = profile.emails[0].value;
                        newUser.google.name = profile.name.givenName + ' ' + profile.name.familyName;
                        newUser.name = profile.name.givenName + ' ' + profile.name.familyName;
                        newUser.email = profile.emails[0].value;
    
                        newUser.save(err => {
                            if (err) {
                                console.log(err);
                                throw err;
                            }
    
                            return done(null, newUser);
                        });
                    }
                });
            });
        }
    ));
};


passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findOne({ _id: id }, (err, user) => {
        const userInformation = {
            username: user.username,
        };
        done(err, userInformation);
    });
});
