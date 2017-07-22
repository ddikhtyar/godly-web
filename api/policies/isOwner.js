module.exports = function isOwner(req, res, next) {
  let prms = req.query || req.allParams();
  // console.log('isOwner.js EXECUTE....');
  // console.log('req.session.userId=' + req.session.userId);
  // console.log('prms:');
  // console.log(prms);
  //

  // If the user agent DOES NOT have a user id stored in their session...
  if (!req.session.userId && prms=={}) {
    if (req.wantsJSON) {
      return res.forbidden('You are not permitted to perform this action.');
    }
    return res.redirect('/');
  }

  // Search for a user based upon the user record id in the session
  User.findOne(req.session.userId).exec(function(err, foundUser){

    // Handle any errors from the findOne query.
    if (err) return res.negotiate(err);

    // If the user id associated with this session does not correspond
    // with a User record in the database...
    if (!foundUser) {
      if (req.wantsJSON) {
        return res.forbidden('You are not permitted to perform this action.');
      }
      // console.log('!foundUser');
      return res.forbidden('You are not permitted to perform this action.');
    }
    //
    // console.log('foundUser:');
    // console.log(foundUser);

    //
    if (
         (foundUser.id == prms.id)
      || (foundUser.username == (prms.user || prms.username))
      || (foundUser.email == (prms.user || prms.email))
    ) {
      // console.log('Owner defined');
      return next();

    // Respond with forbidden or redirect based upon the user-agent requirements
    } else {
      if (req.wantsJSON) {
        return res.forbidden('You are not permitted to perform this action.');
      }
      return res.forbidden('You are not permitted to perform this action.');
    }
  });
};
