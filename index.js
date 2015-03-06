var jsTransform = require('jstransform');
var visitors = require('./visitors');

var jsxControlTransform = function(src) {
  return jsTransform.transform(visitors.visitorList, src).code;
}

module.exports = jsxControlTransform;
