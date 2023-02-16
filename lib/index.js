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
    console.log('parsing html element');
    const element = { type: 'Element' };
    const tagName = readWhileMatching(/[a-z]/i);
    console.log(content.slice(i));
    if (tagName === '') {
      element.type = 'Fragment';
    } else {
      element.name = tagName;
      element.attributes = parseAttributeList();
    }
    eat('>');
    const endTag = `</${tagName}>`;
    // console.log({ endTag });
    element.children = parseFragments(() => match(endTag));
    eat(endTag);
    console.log('after reading end tag');
    console.log(content.slice(i));
    return element;
  }

  function parseFragments(condition) {
    const fragments = [];

    while (!condition()) {
      skipWhiteSpace();
      console.log('parsing children', condition());
      console.log(content.slice(i));

      const fragment = parseElement() ?? parseJavascript() ?? parseText();
      fragments.push(fragment);
    }
    return fragments;
  }
  function parseText() {
    // console.log('parsing text');
    // console.log(content.slice(i));
    return {
      type: 'Text',
      value: readWhileMatching(/[^\{\<]/).trim(),
    };
  }
  function parseJavascript() {
    if (!match('{')) return;
    // console.log('parsing javascript expression');
    // console.log(content.slice(i));
    eat('{');
    const expression = readWhileMatching(/[^\}]/);
    eat('}');
    return {
      type: 'Expression',
      value: expression,
    };
  }
  function parseAttributeList() {
    skipWhiteSpace();
    console.log('parsing attribute list');
    const attributeList = [];
    while (!match('>')) {
      const attribute = parseJavascript() ?? parseAttribute();
      attributeList.push(attribute);
    }
    return attributeList;
  }
  function parseAttribute() {
    skipWhiteSpace();
    // console.log('parsing attribute');
    const attribute = {
      type: 'Attribute',
      name: readWhileMatching(/[^=\s\t\{]/),
      value: null,
    };
    if (!match('=')) {
      return attribute;
    }
    eat('=');
    if (match('{')) {
      attribute.value = parseJavascript();
    } else {
      attribute.value = readWhileMatching(/[^\n\t\s]/);
    }
    // console.dir({ attribute });
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
