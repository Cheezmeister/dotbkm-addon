var main = require("../js/dotbkm");

exports["test main"] = function(assert) {
  assert.pass("Unit test running!");
};

exports["test main async"] = function(assert, done) {
  assert.pass("async Unit test running!");
  done();
};

exports["test makeBookmark"] = function (assert) {
  main.makeBookmark({title: 'blah'});
  assert.pass("enough");
}

require("sdk/test").run(exports);
