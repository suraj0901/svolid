import * as fs from 'fs';

const content = fs.readFileSync('src/app.jsx', 'utf-8');

const ast = parse(content);

// const analysis = analyse(ast);
// const js = genrate(ast, analysis);

fs.writeFileSync('public/app.js', JSON.stringify(ast, null, 2), 'utf-8');

function parse(content) {
  let i = 0;
  const ast = {};
  readWhileMatching(/[^\<]/);
  ast.html = parseElement();
  return ast;

  function parseElement() {
    if (!match('<')) return;
    eat('<');
    const tagName = readWhileMatching(/[a-z]/i);
    const attributes = parseAttributeList();
    eat('>');
    const endTag = `</${tagName}>`;
    const element = {
      type: 'Element',
      name: tagName,
      attributes,
      children: parseFragments(() => match(endTag)),
    };
    eat(endTag);
    return element;
  }

  function parseFragments(condition) {
    const fragments = [];
    while (!condition()) {
      const fragment = parseElement() ?? parseJavascript() ?? parseText();
      fragments.push(fragment);
    }
    return fragments;
  }
  function parseText() {
    return {
      type: 'Text',
      value: readWhileMatching(/[^\{\<]/).trim(),
    };
  }
  function parseJavascript() {
    if (!match('{')) return;
    eat('{');
    const expression = readWhileMatching(/\}/);
    eat('}');
    return {
      type: 'Expression',
      value: expression,
    };
  }
  function parseAttributeList() {
    skipWhiteSpace();
    const attributeList = [];
    while (!match('>')) {
      const attribute = parseJavascript() ?? parseAttribute();
      attributeList.push(attribute);
    }
    return attributeList;
  }
  function parseAttribute() {
    skipWhiteSpace();
    const attribute = {
      type: 'Attribute',
      name: readWhileMatching(/[^=\s\t\{]/),
      value: null,
    };
    if (match('=')) {
      eat('=');
      attribute.value = readWhileMatching(/[^\n\t\s]/);
    } else if (match('{')) {
      eat('{');
      attribute.value = parseJavascript();
    }
    return attribute;
  }

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
  function skipWhiteSpace() {
    readWhileMatching(/[\n\t\s]/);
  }
}
function analysis(ast) {}
function genrate(ast, analysis) {}
