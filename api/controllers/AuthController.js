var passport = require('passport');
module.exports = {

    login: function(req, res, next) {
        //Вызываем метод authenticate с LocalStrategy
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
                req.session.auth = true;
                req.session.User = user;

                res.redirect('/');
            });
        })(req, res); //IMPORTANT: обращаем внимание на то, что мы вызываем authenticate('login', ...)(req,res);
        //Passport'у нужно получить значения логина\пароля с req.body
    },

    logout: function(req, res, next) {
        //Чистим куки с нашим token'ом
        res.clearCookie('token');
        req.logout();
        res.redirect('/');
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
