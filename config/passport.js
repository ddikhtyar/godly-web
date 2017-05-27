
var
    passport = require('passport'), //passport
    LocalStrategy = require('passport-local').Strategy, //Локальную стратегию
    RememberMeStrategy = require('passport-remember-me').Strategy, //Remember Me стратегию
    passwordHash = require('password-hash');
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
        //console.log('LocalStrategy');
        //Ищем пользователя с введенным логином или email'ом
        // User
        //     .findOne()
        //     .where({
        //         or: [{
        //             username: username
        //         }, {
        //             email: username
        //         }]
        //     },function(error, user) {
        //         if (error) {
        //             console.log(error);
        //             next(error);
        //         } else if (!user) {
        //             next(null, false, { message: 'This user not exists' });
        //         //} else if (!bcrypt.compareSync(password, user.password)) {
        //         } else if (!passwordHash.verify(user.password,password)) {
        //             next(null, false, { message: 'Wrong password' });
        //         } else {
        //             //вызываем внутренний метод для скрытия нежелательных полей
        //             var returnUser = user.toJSON();
        //             next(null, returnUser, { message: 'Logged In Successfully' });
        //         }
        //     });
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
            .done(function(error, user) {
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
