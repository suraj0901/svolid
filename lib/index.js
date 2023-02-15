import * as fs from 'fs';

const content = fs.readFileSync('src/app.jsx', 'utf-8');

const ast = parse(content);
// const analysis = analyse(ast);
// const js = genrate(ast, analysis);

// fs.writeFileSync('public/app.js', js, 'utf-8');

function parse(content) {
  let i = 0;
  const ast = {};
  ast.html = parseFragment();
  return ast;

  function parseFragment() {}
  function parseElement() {}
  function parseText() {}
  function parseJavascript() {}
  function parseAttributeList() {}
  function parseAttribute() {}

  function match(str) {
    return content.slice(i, i + str.length) === str;
  }

  function eat(str) {
    if (match(str)) {
      i += str.length;
    } else {
      throw new Error(`Parse error: expecting '${str}'`);
    }
  }
}
function analysis(ast) {}
function genrate(ast, analysis) {}
