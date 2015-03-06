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
  return object.type === 'JSXElement' && object.openingElement.name.name === 'For';
};

function visitJSXOpeningElement(traverse, object, path, state) {
  var attributes = object.attributes;

  if (!attributes || !attributes.length) {
    throwMissingAttr();
  }

  var eachCondition, ofCondition;
  attributes.forEach(function (attr) {
    if (attr.name.name === 'each') {
      eachCondition = attr;
    } else if (attr.name.name === 'of') {
      ofCondition = attr;
    }
  });

  if (!eachCondition || !ofCondition) {
    throwMissingAttr();
  }

  utils.append('{', state);
  utils.move(ofCondition.value.expression.range[0], state);
  utils.catchup(ofCondition.value.expression.range[1], state);
  utils.append('.map(function(', state);
  utils.move(eachCondition.value.range[0] + 1, state);
  utils.catchup(eachCondition.value.range[1] - 1, state);
  utils.append(') { return (', state);
  utils.move(object.range[1], state);
}
visitJSXOpeningElement.test = function(object, path, state) {
  return (object.type === 'JSXOpeningElement' && object.name && object.name.name === 'For' && !object.selfClosing);
}

function visitJSXClosingElement(traverse, object, path, state) {
  utils.move(object.range[1], state);
  utils.append(')}, this)}', state);
}
visitJSXClosingElement.test = function(object, path, state) {
  return (object.type === 'JSXClosingElement' && object.name && object.name.name === 'For');
}

function throwMissingAttr() {
  throw new Error("<If> tag with no 'each' or 'of' attribute");
}

function throwMultipleRootElement() {
  throw new Error("<If> tag must only contain a single root element");
}

module.exports = [visitJSXOpeningElement, visitJSXClosingElement, visitJSXElement];
