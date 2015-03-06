var utils = require('jstransform/src/utils');

function visitJSXElement(traverse, object, path, state) {
  var children = [];
  object.children.forEach(function(child) {
    if (child.type !== "Literal" || child.value.trim().length > 0) {
      children.push(child);
    }
  });
  if (children.length > 1) {
    throwMultipleRootElement();
  }
}
visitJSXElement.test = function (object, path, state) {
  return object.type === 'JSXElement' && object.openingElement.name.name === 'If';
};

function visitJSXOpeningElement(traverse, object, path, state) {
  var attributes = object.attributes;

  if (!attributes || !attributes.length) {
    throwNoConditionAttr();
  }

  var condition;
  attributes.forEach(function (attr) {
    if (attr.name.name === 'condition') {
      condition = attr;
    }
  });

  if (!condition) {
    throwNoConditionAttr();
  }

  utils.append('{function() {' +
  'if (', state);
  utils.move(condition.value.expression.range[0], state);
  utils.catchup(condition.value.expression.range[1], state);
  utils.append(')  return (', state);
  utils.move(object.range[1], state);
}
visitJSXOpeningElement.test = function(object, path, state) {
  return (object.type === 'JSXOpeningElement' && object.name && object.name.name === 'If' && !object.selfClosing);
}

function visitJSXClosingElement(traverse, object, path, state) {
  utils.move(object.range[1], state);
  utils.append(')' +
    '}.call(this)}', state);
}
visitJSXClosingElement.test = function(object, path, state) {
  return (object.type === 'JSXClosingElement' && object.name && object.name.name === 'If');
}

function throwNoConditionAttr() {
  throw new Error("<If> tag with no condition attribute");
}

function throwMultipleRootElement() {
  throw new Error("<If> tag must only contain a single root element");
}

module.exports = [visitJSXOpeningElement, visitJSXClosingElement, visitJSXElement];
