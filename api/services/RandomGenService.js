
var randomstring = function(len) {
  var buf = []
    , chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    , charlen = chars.length;

  for (var i = 0; i < len; ++i) {
    buf.push(chars[randomint(0, charlen - 1)]);
  }

  return buf.join('');
};

var randomint = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

module.exports = {
  randomString: randomstring,
  randomInt: randomint,
};
