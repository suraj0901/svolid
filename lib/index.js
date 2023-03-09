import * as fs from 'fs';
// import { walk } from 'estree-walker';
const content = fs.readFileSync('src/app.jsx', 'utf-8');

let i = 0;
let result = content;
while (i <= content.length) {
    // console.log('first render');

    const { ast, startIndex, endIndex } = parse(content);
    // const analysis = analyse(ast);
    const val = genrate(ast, analysis);
    // console.log({ html: ast.html });
    // result.push(ast);
    // result.push(js);
    if (val) {
        const [ssr, hydration] = val;
        result =
            result.slice(0, startIndex) + ssr + result.slice(endIndex + 1);
    }
}
// fs.writeFileSync('public/app.json', JSON.stringify(result, null, 2), 'utf-8');
fs.writeFileSync('public/app.js', result, 'utf-8');

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
            const attribute = parseAttribute();
            attributeList.push(attribute);
        }
        return attributeList;
    }
    function parseAttribute() {
        skipWhiteSpace();
        // console.log('parsing attribute');
        // console.log(content.slice(i));
        if (match('{')) {
            const value = parseJavascript();
            return {
                type: 'Attribute',
                name: value.value,
                value,
            };
        }
        if (match('{...')) {
            const value = parseJavascript();
            return {
                type: 'SpredAttribute',
                value,
            };
        }
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
            attribute.value = {
                type: 'Text',
                value: readWhileMatching(/[^\"]/),
            };
            eat('"');
        } else if (match("'")) {
            eat("'");
            attribute.value = {
                type: 'Text',
                value: readWhileMatching(/[^\']/),
            };
            eat("'");
        } else {
            attribute.value = {
                type: 'Text',
                value: readWhileMatching(/[^\n\t\s\/]/),
            };
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
        let startIndex = i,
            len = content.length;
        while (regex.test(content[i])) {
            i++;
            if (i >= len) break;
        }
        return content.slice(startIndex, i);
    }
    function skipWhiteSpace() {
        readWhileMatching(/[\n\t\s]/);
    }
}
function analysis(ast) { }
function genrate(ast, analysis) {
    const code = {
        client: [],
    };
    let i = 0;

    function traverse(node, currentRef) {
        // console.log('traverse', { node });
        if (!node) return;
        switch (node.type) {
            case 'Fragment': {
                // console.log('Fragment');
                const children = node.children.map((children, index) => {
                    return traverse(children, `${currentRef}.childNodes[${index}]`);
                });
                // console.log({ children });
                return children.join(' ');
            }
            case 'Element': {
                let tag = `<${node.name} `;
                // console.log({ attrList: node.attributes });
                const attr = node.attributes.map((attribute) =>
                    traverse(attribute, currentRef)
                );
                // console.log({ attr });
                tag += attr.join(' ');
                if (node.selfClosing) return tag + '/>';
                tag += '>';
                const children = node.children.map((children, index) => {
                    return traverse(children, `${currentRef}.childNodes[${index}]`);
                });
                // console.log({ elementChildren: node.children });

                tag += children.join(' ') + `</${node.name}>`;
                return tag;
            }
            case 'Attribute': {
                let attribute = '';
                if (node.name.startsWith('on:')) {
                    code.client.push(`${currentRef}.on${node.name.slice(3)}=${node.value.value}`);
                } else if (node.value.type === 'Expression') {
                    code.client.push(
                        `window._runtime$.bindAttr(${currentRef},"${node.name}", () => ${node.value.value})`
                    );
                    attribute = `${node.name}=\${${node.value.value}}`
                } else {
                    attribute = `${node.name}="${node.value.value}"`;
                }
                return attribute;
            }
            case 'Expression': {
                code.client.push(`window._runtime$.bindText(${currentRef}, () => ${node.value});`)
                return `<span>\${${node.value}}</span>`;
            }
            case 'Text': {
                // console.log({ textNode: node });
                return node.value;
            }
            default: {
                // console.log({ type: node.type });
                throw new Error('unexpected type of element');
            }
        }
    }
    // console.log({ html: ast.html });
    const template = traverse(ast.html, '_el$');
    if (template) {
        return [
            ` \` ${template} \``,
            `(${code.client.join('\n')})()`
        ];
    }
}
