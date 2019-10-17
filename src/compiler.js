/* eslint-disable no-prototype-builtins */
const generate = require('@babel/generator');
const { isLookaLike } = require('./utils');
const t = require('@babel/types');

module.exports = class PreProcessingCompiler {
  constructor(node) {
    this.directDeclarationsTypes = ['StringLiteral', 'NumericLiteral'];
    this.inDirectDeclarationsTypes = ['Identifier'];
    this.EvaluationRequiredTypes = ['BinaryExpression'];
    this.preExtractionSets = {};
    this.newNodeUsingType = {
      number: val => {
        return t.numericLiteral(val);
      },
      string: val => {
        return t.stringLiteral(val);
      }
    };
    this.createPreExtractionMap(node);
  }
  createPreExtractionMap(node) {
    const { body } = node.program;
    body.forEach(nd => {
      if (nd.kind === 'const' && nd.type === 'VariableDeclaration') {
        const { declarations } = nd;
        declarations.forEach(dec => {
          if (dec.type === 'VariableDeclarator') {
            if (this.directDeclarationsTypes.includes(dec.init.type)) {
              this.preExtractionSets[dec.id.name] = dec.init.value;
            } else if (this.inDirectDeclarationsTypes.includes(dec.init.type)) {
              if (dec.init.hasOwnProperty('name')) {
                const thisValue = this.preExtractionSets[dec.init.name];
                this.preExtractionSets[dec.id.name] = thisValue;
              }
            } else if (
              (dec.init.type === 'FunctionExpression' || dec.init.type === 'ArrowFunctionExpression') &&
              dec.init.hasOwnProperty('body')
            ) {
              this.resolveFnBodyForReturnExtraction(dec);
            } else if (
              dec.type === 'VariableDeclarator' &&
              dec.init.type === 'ObjectExpression' &&
              dec.init.hasOwnProperty('properties')
            ) {
              const { properties } = dec.init;
              properties.forEach(objProps => {
                if (objProps.value.type === 'ArrowFunctionExpression' || objProps.value.type === 'FunctionExpression') {
                  const { body } = objProps.value;
                  const { type, name } = objProps.key;
                  if (type === 'Identifier') {
                    body.body.forEach(bdy => {
                      if (bdy.type === 'ReturnStatement' && this.directDeclarationsTypes.includes(bdy.argument.type)) {
                        this.preExtractionSets[`${dec.id.name}.${name}`] = bdy.argument.value;
                        console.log(this.preExtractionSets);
                      }
                    });
                  }
                }
              });
            } else if (this.EvaluationRequiredTypes.includes(dec.init.type)) {
              this.preExtractionSets[dec.id.name] = this.compileTheExpression(dec.init);
            }
          }
        });
      }
    });
  }
  resolveFnBodyForReturnExtraction(dec) {
    const functionaExpBody = dec.init.body;
    if (functionaExpBody.type === 'BlockStatement' && functionaExpBody.hasOwnProperty('body')) {
      const funtionStatementBody = functionaExpBody.body;
      funtionStatementBody.forEach(fnBody => {
        if (fnBody.type === 'ReturnStatement') {
          if (this.directDeclarationsTypes.includes(fnBody.argument.type)) {
            const { value } = fnBody.argument;
            this.preExtractionSets[dec.id.name] = value;
          }
          if (this.inDirectDeclarationsTypes.includes(fnBody.argument.type)) {
            if (this.preExtractionSets.hasOwnProperty(fnBody.argument.name)) {
              this.preExtractionSets[dec.id.name] = this.preExtractionSets[fnBody.argument.name];
            }
          }
        }
      });
    }
  }
  // eslint-disable-next-line class-methods-use-this
  compileTheExpression(node) {
    // eslint-disable-next-line no-eval
    return eval(generate.default(node).code);
  }

  transform(node) {
    node.body = node.body
      .filter(
        b =>
          b.type !== 'VariableDeclaration' ||
          b.kind !== 'const' ||
          (b.kind === 'const' && !b.declarations.every(d => Object.keys(this.preExtractionSets).includes(d.id.name)))
      )
      .map(bdy => this.transformHandler(bdy));
    return node;
  }
  transformHandler(bdy) {
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
      bdy.declarations = this.handleVarDeclarations(bdy);
    }
    if (isCallExpressions) {
      bdy = this.handleCallExp(bdy);
    }
    return bdy;
  }
  handleCallExp(bdy) {
    if (bdy.expression.hasOwnProperty('arguments')) {
      bdy.expression.arguments = bdy.expression.arguments.map(arg => {
        if (arg.type === 'Identifier' && Object.keys(this.preExtractionSets).includes(arg.name)) {
          const currVal = this.preExtractionSets[arg.name];
          const newNode = this.newNodeUsingType[typeof currVal](currVal);
          return newNode;
        }
        if (arg.type === 'CallExpression' && Object.keys(this.preExtractionSets).includes(arg.callee.name)) {
          const currVal = this.preExtractionSets[arg.callee.name];
          const newNode = this.newNodeUsingType[typeof currVal](currVal);

          return newNode;
        }

        return arg;
      });
    }
    return bdy;
  }
  handleVarDeclarations(bdy) {
    if (Object.keys(this.preExtractionSets).includes(bdy.declarations[0].init.name)) {
      const currVal = this.preExtractionSets[bdy.declarations[0].init.name];
      const newNode = this.newNodeUsingType[typeof currVal](currVal);
      bdy.declarations[0].init = newNode;
    }
    return bdy.declarations;
  }
};
