/**
 * User.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */
module.exports = {
  connection: 'firebase',

  attributes: {

    createdAt: {
      type: 'datetime'
    },

    updatedAt:{
      type: 'datetime'
    },

    email: {
      type: 'string',
      email: 'true',
      unique: 'true'
    },

    username: {
      type: 'string',
      unique: 'true'
    },

    firstName: { type: 'string' },

    lastName: { type: 'string' },

    encryptedPassword: {
      type: 'text',
      minLength: 6,
      columnName: 'hashed_password'
    },

    gravatarURL: {
      type: 'string'
    },

    deleted: {
      type: 'boolean',
      defaultsTo: false
    },

    admin: {
      type: 'boolean',
      defaultsTo: false
    },

    banned: {
      type: 'boolean',
      defaultsTo: false
    },

    passwordRecoveryToken: {
      type: 'string'
    },

    // tutorials: {
    //   type: 'json'
    // },

    // tutorials: {
    //   collection: 'tutorial',
    // },

    tutorials: {
      collection: 'tutorial',
      via: 'owner'
    },

    ratings: {
      collection: 'rating',
      via: 'byUser'
    },

    // Who is following me?
    followers: {
      collection: 'user',
      via: 'following'
    },

    // Who am I following?
    following: {
      collection: 'user',
      via: 'followers'
    },

    chats: {
      collection: 'chat',
      via: 'sender'
    },

    autoLoginHash: {type: 'string'},

    toJSON: function() {
      var obj = this.toObject();
      delete obj.password;
      delete obj.encryptedPassword;
      delete obj.autoLoginHash;
      delete obj.passwordRecoveryToken;
      return obj;
    }
  },

  /**
 * User.formatForTopbar()
 *
 * Build up some formatted information about the requesting user.
 * (i.e. to send down to a view)
 *
 * > If the user is not logged in, then we expect that something
 * > falsy will be passed in instead of a user record.
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * @param  {Dictionary?} loggedInUserMaybe
 *         A user record representing the currently-logged in user
 *         (or something falsy to represent that the user is not logged in)
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * @returns {Dictionary}
 *          @property {String} idUser
 *          @property {String} email
 *          @property {Boolean} isLoggedIn
 *          @property {String} username
 *          @property {String} fullName
 *          @property {String} gravatarURL
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 */
 formatForTopbar: function (loggedInUserMaybe) {

    // if logged in...
    if (loggedInUserMaybe) {
      return {
        idUser: loggedInUserMaybe.id,
        email: loggedInUserMaybe.email,
        isLoggedIn: true,
        username: loggedInUserMaybe.username,
        fullName: loggedInUserMaybe.firstName + ' ' +loggedInUserMaybe.lastName,
        gravatarURL: loggedInUserMaybe.gravatarURL
      };
    }

    // otherwise, not logged in...
    return {
      idUser: undefined,
      email: undefined,
      isLoggedIn: false,
      username: 'guest',
      fullName: 'Guest',
      avatarSrc: 'https://placekitten.com/g/200/200'
    };
  },

  /**
   * User.fetchForTopbar()
   *
   * Fetch, format, and return a formatted dictionary (plain JS object) of info
   * about the requesting user; whether or not he or she is logged in.
   * This info is intended for use when displaying the whether or not the requesting
   * user is logged in (i.e. at the top-right of most public pages, and some private
   * web pages on our site).
   *
   * > This method can also be used to look up a basic summary of the requesting
   * > user; e.g. for use in the pure API endpoints we expose for use by our
   * > native Android app, and from our Mac OS X app (i.e. an SPA wrapped up in
   * > an Electron frame.)
   * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
   * @param  {Ref} req
   *         The incoming HTTP/vHTTP request.
   * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
   * @callback {Function} done
   *
   *        @param {Error?} err
   *          @property {String?} code
   *                    If the request came from an orphaned session, then the
   *                    `code` property of this error will be E_ORPHANED_SESSION.
   *                    Otherwise, if `err` is truthy, it indicates that some other
   *                    miscellaneous, unexpected error has occurred.
   *
   *        @param {Dictionary} requestingUserInfo
   *          @property {String} idUser
   *          @property {String} email
   *          @property {Boolean} isLoggedIn
   *          @property {String} username
   *          @property {String} fullName
   *          @property {String} avatarSrc
   * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
   */
  fetchForTopbar: function (req, done) {

    // Check out the user id in the session.
    // > If it is falsy, then that just means this request did not come
    // > from a logged-in user.
    var userIdMaybe = req.session.userId;

    // Not logged in...
    if (!userIdMaybe) {

      // So send back guest info.
      return done(undefined, {
        idUser: undefined,
        email: undefined,
        isLoggedIn: false,
        username: 'guest',
        fullName: 'Guest',
        gravatarURL: 'https://placekitten.com/g/200/200'
      });

    }

    // Otherwise, the requesting user IS logged in, so look up his/her record
    // from the database.
    User.findOne({
      id: userIdMaybe
    })
    .exec(function(err, loggedInUser) {
      if (err) { return done(err); }
      if (!loggedInUser) {
        err = new Error(
          'This request came from a logged-in user (id: ' + userIdMaybe + '), '+
          'but his/her database record has somehow been deleted!  They should be '+
          'logged out automatically and redirected to the login page.'
        );
        err.code = 'E_ORPHANED_SESSION';
        return done(err);
      }

      // IWMIH, then we were able to fetch this logged in user's record from the database,
      // and so we'll format the result and send it back.
      return done(undefined, {
        idUser: loggedInUserMaybe.id,
        email: loggedInUserMaybe.email,
        isLoggedIn: true,
        username: loggedInUser.username,
        fullName: loggedInUser.firstName + loggedInUser.lastName,
        gravatarURL: loggedInUser.gravatarURL
      });
    });
  },
};
