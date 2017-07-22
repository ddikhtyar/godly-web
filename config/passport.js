
const passport = require('passport'); //passport
const LocalStrategy = require('passport-local').Strategy; //Локальную стратегию
const RememberMeStrategy = require('passport-remember-me').Strategy;//Remember Me стратегию
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt; // авторизация через JWT
const Passwords = require('machinepack-passwords');
// const passwordHash = require('password-hash');

var generator = require("../api/services/RandomGenService.js");

const EXPIRES_IN_MINUTES = 60 * 24;
const SECRET = '0424c9e5c320f6255d27dda80f752c73';

/**
 * Configuration object for local strategy
 */
var LOCAL_STRATEGY_CONFIG = {
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: false
};

//Настроим локальную стратегию
passport.use(new LocalStrategy(LOCAL_STRATEGY_CONFIG,
    function(username, password, next) {
        console.log('LocalStrategy... login-%s password-%s',username,password);
        let query = User.findOne();
        if(username.toString().indexOf('@') != -1){
          query = query.where({ 'email' : username });
        } else {
          query = query.where({ 'username' : username });
        }

        //console.log(query);//тут можно посмотреть внутренности
        query
          .exec(function(error, user) {

            if (error) {
                console.log('EXEC ERROR!! ');
                console.log(error);
                next(error);
            } else if (!user) {
                console.log('user not exists!! ');
                next(null, false, { message: 'This user not exists' });
            };
            console.log('user exists!! ' + user);

            Passwords.checkPassword({
              passwordAttempt: password,
              encryptedPassword: user.encryptedPassword
            }).exec({
              error: function(err) {
                next(error, false, { negotiate:true, message: 'checkPassword throu ERROR' });
              },
              incorrect: function() {
                console.log('Wrong password');
                next(null, false, { incorrect:true,  message: 'Wrong password' });
              },
              success: function() {
                console.log('User founded.');
                var returnUser = user.toJSON();
                next(null, returnUser, { message: 'Logged In Successfully' });
              }
            });
        });
    }
));


/**
 * Configuration object for JWT strategy
 */
var JWT_STRATEGY_CONFIG = {
  jwtFromRequest: ExtractJwt.fromAuthHeader(),
  secretOrKey: SECRET
};
/**
 * Triggers when user authenticates via JWT strategy
 */
function _onJwtStrategyAuth(payload, next) {
      console.log('_onJwtStrategyAuth for userId %s IN.....',payload.id);

      if(!!payload && !!payload.id){
        next(null, payload, { message: 'Logged In Successfully' });
      } else {
        console.log('user not exists!! ');
        next(null, false, { message: 'This user not exists' });
      }
      // let query = User.findOne();
      // query = query.where({ 'id' : payload.id });
      // query
      //   .exec(function(error, user) {
      //     if (error) {
      //         console.log('EXEC ERROR!! ');
      //         console.log(error);
      //         next(error);
      //     } else if (!user) {
      //         console.log('user not exists!! ');
      //         next(null, false, { message: 'This user not exists' });
      //     } else {
      //       var returnUser = user.toJSON();
      //       next(null, returnUser, { message: 'Logged In Successfully' });
      //     };
      // });
};

passport.use(
  new JwtStrategy(JWT_STRATEGY_CONFIG, _onJwtStrategyAuth));



//Настраиваем RememberMe стратегию
passport.use(new RememberMeStrategy({
        key: 'remember_me' //Указываем имя cookie, где хранится ваш token
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
                    var returnUser = user.toJSON();
                    done(null, returnUser, { message: 'Logged In Successfully' });
                }
            });
    }, function(user, done) {
        //И генерируем новый token
        //var token = crypto.randomBytes(32).toString('hex');
        var token = generator.randomString(32).toString('hex');
        user.autoLoginHash = token;
        user.save(function() {});
        done(null, token, { message: 'Logged In Successfully' });
    })
);


//нужно задать функции serialize\deserialize.
passport.serializeUser(function(user, next) {
    console.log('passport.serializeUser');
    next(null, user.id);
});

passport.deserializeUser(function(id, next) {
    User
        .findOne({ id: id })
        .exec(function(error, user) {
            console.log('passport.deserializeUser id ' + id);
            next(error, user);
        });
});
