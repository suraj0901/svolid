import * as fs from 'fs';

const content = fs.readFileSync('src/app.jsx', 'utf-8');

let i = 0;
while (i < content.length) {
  const { ast, startIndex, endIndex } = parse(content);
  // const analysis = analyse(ast);
  // const js = genrate(ast, analysis);
  fs.writeFileSync('public/app.json', JSON.stringify(ast, null, 2), 'utf-8');
}

function parse(content) {
  // let i = 0;
  const ast = {};
  readWhileMatching(/[^\<]/);
  const startIndex = i;
  ast.html = parseElement();
  const endIndex = i;
  return { ast, startIndex, endIndex };

  function parseElement() {
    if (!match('<')) return;
    eat('<');
    // console.log('parsing html element');
    const element = { type: 'Element' };
    const tagName = readWhileMatching(/[a-z]/i);
    // console.log(content.slice(i));
    if (tagName === '') {
      element.type = 'Fragment';
    } else {
      element.name = tagName;
      element.attributes = parseAttributeList();
    }
    if (match('/')) {
      eat('/>');
      element.selfClosing = true;
      return element;
    }
    eat('>');
    const endTag = `</${tagName}>`;
    // console.log({ endTag });
    element.children = parseFragments(() => match(endTag));
    eat(endTag);
    // console.log('after reading end tag');
    // console.log(content.slice(i));
    return element;
  }

  function parseFragments(condition) {
    const fragments = [];

    while (!condition()) {
      // console.log('parsing children', condition());
      // console.log(content.slice(i));

      const fragment = parseElement() ?? parseJavascript() ?? parseText();
      if (fragment) fragments.push(fragment);
      skipWhiteSpace();
    }
    return fragments;
  }
  function parseText() {
    // console.log('parsing text');
    // console.log(content.slice(i));
    const text = readWhileMatching(/[^\{\<]/).trim();
    if (text === '') return;
    return {
      type: 'Text',
      value: text,
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
    // console.log('parsing attribute list');
    // console.log(content.slice(i));
    const attributeList = [];
    while (!match('>') && !match('/')) {
      const attribute = parseJavascript() ?? parseAttribute();
      attributeList.push(attribute);
    }
    return attributeList;
  }
  function parseAttribute() {
    skipWhiteSpace();
    // console.log('parsing attribute');
    // console.log(content.slice(i));

    const attribute = {
      type: 'Attribute',
      name: readWhileMatching(/[^=\s\t\{\/]/),
      value: null,
    };
    if (!match('=')) {
      return attribute;
    }
    eat('=');
    skipWhiteSpace();
    if (match('{')) {
      attribute.value = parseJavascript();
    } else if (match('"')) {
      eat('"');
      attribute.value = readWhileMatching(/[^\"]/);
      eat('"');
    } else if (match("'")) {
      eat("'");
      attribute.value = readWhileMatching(/[^\']/);
      eat("'");
    } else {
      attribute.value = readWhileMatching(/[^\n\t\s\/]/);
    }
    console.dir({ attribute });
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
