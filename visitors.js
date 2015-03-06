var ifVisitor = require('./if');
var forVisitor = require('./for');

module.exports = {
  visitorList: ifVisitor.concat(forVisitor)
};
