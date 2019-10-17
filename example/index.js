const v = 5;
const z = 'a';
function hello(x) {
  console.log('hellox', x);
}
const tests = 5 + 2;
const afn = () => {
  return v;
};
const fn = function() {
  return 'fn';
};
var a = v;
let a2 = z;
const fn2 = function() {
  return a2;
};
hello(v);
hello(z);

const he = {
  what: () => {
    return 'qwe';
  }
};

const fntest = he.what(); //  needs to cover this !!!

console.log('fntest', fntest);
console.log('tests', tests);
console.log('fn', fn());
console.log('afn', afn());
console.log('fn2', fn2());
hello(afn());
console.log('v', v);
