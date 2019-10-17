/* eslint-disable no-unused-expressions */
// ASTEXPLORER LINK = https://astexplorer.net/#/gist/6a2e63579a8fa791b9c116e641c9e221/a804ba3c0ac55f620bd15d37efbade2400f026cf
const { parse } = require('@babel/parser');
const generate = require('@babel/generator');

const PreProcessingCompiler = require('./compiler');

const loader = content => {
  this.cacheable && this.cacheable();
  const node = parse(content);
  const compiler = new PreProcessingCompiler(node);
  node.program = compiler.transform(node.program);
  return generate.default(node.program).code;
};

export default loader;
