/* eslint-disable no-prototype-builtins */
const { isLookaLike } = require('./utils');

function handleCallExp(bdy, extractedMap, t, newNodeUsingType) {
  if (bdy.expression.hasOwnProperty('arguments')) {
    bdy.expression.arguments = bdy.expression.arguments.map(arg => {
      if (arg.type === 'Identifier' && Object.keys(extractedMap).includes(arg.name)) {
        const currVal = extractedMap[arg.name];
        const newNode = newNodeUsingType[typeof currVal](currVal);
        return newNode;
      }
      if (arg.type === 'CallExpression' && Object.keys(extractedMap).includes(arg.callee.name)) {
        const currVal = extractedMap[arg.callee.name];
        const newNode = newNodeUsingType[typeof currVal](currVal);

        return newNode;
      }

      return arg;
    });
  }
  return bdy;
}
function handleVarDeclarations(bdy, extractedMap, t, newNodeUsingType) {
  if (Object.keys(extractedMap).includes(bdy.declarations[0].init.name)) {
    const currVal = extractedMap[bdy.declarations[0].init.name];
    const newNode = newNodeUsingType[typeof currVal](currVal);
    bdy.declarations[0].init = newNode;

    return bdy.declarations;
  }
  return bdy.declarations;
}
function transformHandler(bdy, extractedMap, t) {
  const newNodeUsingType = {
    number: val => {
      return t.numericLiteral(val);
    },
    string: val => {
      return t.stringLiteral(val);
    }
  };
  // console.log(bdy);
  const isVariableDeclaration =
    isLookaLike(bdy, {
      type: 'VariableDeclaration',
      kind: 'var'
    }) ||
    isLookaLike(bdy, {
      type: 'VariableDeclaration',
      kind: 'let'
    });
  const isCallExpressions = isLookaLike(bdy, {
    type: 'ExpressionStatement',
    expression: {
      type: 'CallExpression'
    }
  });
  if (isVariableDeclaration) {
    bdy.declarations = handleVarDeclarations(bdy, extractedMap, t, newNodeUsingType);
  }
  if (isCallExpressions) {
    bdy = handleCallExp(bdy, extractedMap, t, newNodeUsingType);
  }
  return bdy;
}

function transform(node, extractedMap, t) {
  // console.log(extractedMap);
  node.body = node.body
    .filter(b => b.type !== 'VariableDeclaration' || b.kind !== 'const')
    .map(bdy => transformHandler(bdy, extractedMap, t));
  return node;
}

module.exports = {
  handleCallExp,
  transform,
  transformHandler,
  handleVarDeclarations
};
