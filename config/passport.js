
var
    passport = require('passport'), //passport
    LocalStrategy = require('passport-local').Strategy, //Локальную стратегию
    RememberMeStrategy = require('passport-remember-me').Strategy, //Remember Me стратегию
    passwordHash = require('password-hash'),
    Passwords = require('machinepack-passwords')
    ;
var generator = require("../api/services/RandomGenService.js");
//Чтобы добавить поддержку "login sessions"
//нужно задать функции serialize\deserialize.
passport.serializeUser(function(user, next) {
    //console.log('passport.serializeUser');
    next(null, user.id);
});

passport.deserializeUser(function(id, next) {
    User
        .findOne({ id: id })
        .done(function(error, user) {
            //console.log('passport.deserializeUser id ' + id);
            next(error, user);
        });
});

//Настроим локальную стратегию
passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
    },
    function(username, password, next) {
        console.log('LocalStrategy... login-%s password-%s',username,password);
        //Ищем пользователя с введенным логином или email'ом
        // var myQuery = User.find();
        // myQuery
        // .where({
        //     or: [
        //       { email : username},
        //       { username : username}
        //     ]
        // })
        // .limit(1);
        User
          .findOne({id:'-KlDS_ANaTrvAD0YmpzH'})
          .exec(function(error, user) {

            if (error) {
                console.log('EXEC ERROR!! ');
                console.log(error);
                next(error);
            } else if (!user) {
                next(null, false, { message: 'This user not exists' });
            };

            Passwords.checkPassword({
              passwordAttempt: password,
              encryptedPassword: user.encryptedPassword
            }).exec({
              error: function(err) {
                console.log(err);
                next(error);
              },
              incorrect: function() {
                console.log('Wrong password!');
                next(null, false, { message: 'Wrong password' });
              },
              success: function() {
                if (user.deleted) {
                  next(null, false, { message: 'Your account has been deleted.  Please visit godly-web/restore to restore your account.' });
                }
                if (user.banned) {
                  next(null, false, { message: 'Your account has been banned, most likely for adding dog videos in violation of the Terms of Service.  Please contact Chad or his mother.' });
                }
                console.log('User founded.');
                var returnUser = user.toJSON();
                next(null, returnUser, { message: 'Logged In Successfully' });
              }
            });
        });
    }
));

//Настраиваем RememberMe стратегию
passport.use(new RememberMeStrategy({
        key: 'token' //Указываем имя cookie, где хранится ваш token
    },
    function(token, done) {
      console.log('RememberMeStrategy');
        //Ищем пользователя с этим token'ом
        User
            .findOne()
            .where({
                autoLoginHash: token
            })
            .exec(function(error, user) {
                if (error) {
                    done(error);
                } else if (!user) {
                    done(null, false, { message: 'user not found' });
                } else {
                    //Нужно инвалидировать token в целях безопасности
                    delete user.autoLoginHash;
                    user.save(function() {});
                    done(null, user, { message: 'Logged In Successfully' });
                }
            });
    }, function(user, done) {
        //И генерируем новый token
        //var token = crypto.randomBytes(32).toString('hex');
        var token = generator.randomString(16).toString('hex');
        user.autoLoginHash = token;
        user.save(function() {});
        done(null, token, { message: 'Logged In Successfully' });
    }));
