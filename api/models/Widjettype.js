module.exports = {

  attributes: {
    rn : {
      type : "integer",
      required: true
    },
    wname: {
      type: "string",
      required: true
    },
    description:{
      type:"string",
      required: true
    }
  },
beforeCreate : function (values, cb) {
    Sequence.next("widjettype", function(err, num) {
      if (err) return cb(err);
        values.rn = num;
        cb();
    });
}
};
