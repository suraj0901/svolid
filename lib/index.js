import * as fs from 'fs';

const content = fs.readFileSync('src/app.jsx', 'utf-8');

const ast = parse(content);
// const analysis = analyse(ast);
// const js = genrate(ast, analysis);

// fs.writeFileSync('public/app.js', js, 'utf-8');

function parse(content) {
  let i = 0;
  const ast = {};
  ast.html = parseElements();
  return ast;

  function parseElements(test) {
    const elements = [];
    while (test(content[i])) {
      elements.push(parseElement());
    }
    return elements;
  }
  function parseElement() {
    if (match('<')) {
      eat('<');
      const tagName = readWhileMatching(/[a-z]/i);
      const attributes = parseAttributeList();
      eat('>');
      const endTag = `</${tagName}>`;
      const element = {
        type: 'Element',
        name: tagName,
        attributes,
        children: [],
      };
      eat(endTag);
      return element;
    }
  }
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
  function readWhileMatching(regex) {
    let startIndex = i;
    while (regex.test(content[i])) {
      i++;
    }
    return content.slice(startIndex, i);
  }
}
function analysis(ast) {}
function genrate(ast, analysis) {}
