var passport = require('passport');
module.exports = {

    login: function(req, res, next) {
        //Вызываем метод authenticate с LocalStrategy
        passport.authenticate('local', function(error, user, info) {
              console.log('AuthController.login.assport.authenticate.local');
              if ((error) || (!user)) {
                  console.log(error);
                  return res.send({
                      message: info.message,
                      user: user
                  });
              } else {
                //Если все проверки прошли успешно
                //То нужно вызвать метод login
                //и передать объект нашего пользователя
                req.login(user, function(error) {
                  if (error) res.send(error);
                  return res.send({
                      message: info.message,
                      user: user
                });
              });
            }
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
