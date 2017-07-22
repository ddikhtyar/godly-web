var passport = require('passport');
var generator = require("../services/RandomGenService.js");
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt; // авторизация через JWT
const jwt = require('jsonwebtoken'); // аутентификация по JWT для hhtp
const jwtsecret = '0424c9e5c320f6255d27dda80f752c73';
// const jwtsecret = process.env.tokenSecret || '0424c9e5c320f6255d27dda80f752c73';

module.exports = {
    login: function(req, res, next) {
        //Вызываем метод authenticate с LocalStrategy
        var remember_me = req.param('remember_me');
        passport.authenticate('local', function(err, user, info) {
            if ((err) || (!user)) {
                if(!!info.incorrect) return res.notFound("incorrect password!");
                return res.negotiate(err);
            }
            req.logIn(user, function(err) {
                console.log('req.logIn');
                if (err) return res.negotiate(err);
                if(!!info.negotiate) return res.negotiate(err);
                if(!!info.incorrect) return res.notFound("incorrect password!");

                if (user.deleted) {
                  return res.forbidden("'Your account has been deleted.  Please visit http://brushfire.io/restore to restore your account.'");
                }
                if (user.banned) {
                  return res.forbidden("'Your account has been banned, most likely for adding dog videos in violation of the Terms of Service.  Please contact Chad or his mother.'");
                }

                req.session.userId = user.id;
                req.session.authenticated = true;
                req.session.User = user;
                req.body = {user: user};
                console.log('req.body:');
                console.log(req.body);
                console.log('remember_me:' + remember_me);


                if (!!remember_me && remember_me=='on') {

                    const token_jwt = jwt.sign(user, jwtsecret); //здесь создается JWT
                    console.log('token_jwt: ');
                    console.log(token_jwt);
                    User
                      .update({id:user.id},{autoLoginHash:token_jwt})
                      .exec(function afterwards(err, updated) {
                          if (err) {
                            next(err, false, { incorrect:true, message: 'autoLoginHash throu ERROR' });
                          }
                          if (!updated) {
                            next(null, false, { incorrect:true,  message: 'autoLoginHash expired!' });
                          }
                          console.log('Updated user to have autoLoginHash ' + updated[0].autoLoginHash);
                      });
                }
                res.redirect('/');
            });
        })(req, res); //IMPORTANT: обращаем внимание на то, что мы вызываем authenticate('login', ...)(req,res);
        //Passport'у нужно получить значения логина\пароля с req.body
    },

    logout: function(req, res, next) {
        //Чистим куки с нашим token'ом
        res.clearCookie('remember_me');
        delete req.session.userId;
        delete req.session.User;
        req.session.authenticated = false;
        req.logout();
        res.redirect('/');
    },

    checkjwt:function(req,res,next){
      console.log("checkjwt IN....");
      passport.authenticate('jwt', function (err, user) {
        console.log("user:");
        console.log(user);
        if (!!user) {
          let user4tb = User.formatForTopbar(user);
          console.log("hello " + (!!user4tb.firstName ? user4tb.fullName : user4tb.username));
          return res.ok({
            user: user
          });
        } else if (!!err) {
          console.log(err);
          return res.serverError(err);
        } else {
          console.log("Token not finded!")
          return res.forbidden({ negotiate:true, message: 'Token not finded!' });
        }
      } )(req, res);
    },

    // http://developer.github.com/v3/
    // http://developer.github.com/v3/oauth/#scopes
    github: function(req, res) {
      passport.authenticate('github', { failureRedirect: '/login' }, function(err, user) {
        req.logIn(user, function(err) {
          if (err) {
            console.log(err);
            res.view('500');
            return;
          }

          res.redirect('/');
          return;
        });
      })(req, res);
    },

    // https://developers.facebook.com/docs/
    // https://developers.facebook.com/docs/reference/login/
    facebook: function(req, res) {
      passport.authenticate('facebook', { failureRedirect: '/login', scope: ['email'] }, function(err, user) {
        req.logIn(user, function(err) {
          if (err) {
            console.log(err);
            res.view('500');
            return;
          }

          res.redirect('/');
          return;
        });
      })(req, res);
    },

    // https://developers.google.com/
    // https://developers.google.com/accounts/docs/OAuth2Login#scope-param
    google: function(req, res) {
      passport.authenticate('google', { failureRedirect: '/login', scope: ['https://www.googleapis.com/auth/plus.login', 'https://www.googleapis.com/auth/plus.profile.emails.read'] }, function(err, user) {
        req.logIn(user, function(err) {
          if (err) {
            console.log(err);
            res.view('500');
            return;
          }

          res.redirect('/');
          return;
        });
      })(req, res);
    },

    // https://apps.twitter.com/
    // https://apps.twitter.com/app/new
    twitter: function(req, res) {
      passport.authenticate('twitter', { failureRedirect: '/login' }, function(err, user) {
        req.logIn(user, function(err) {
          if (err) {
            console.log(err);
            res.view('500');
            return;
          }

          res.redirect('/');
          return;
        });
      })(req, res);
    },

};
