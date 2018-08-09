import React from "react";

import Inline from './Inline';
import Block from './Block';
import RootBlock from './RootBlock';

const reParse = /(@\[(\w+)[[\]]|]])/;

export default function compile(text) {
    let children = [];
    const stack = [];
    const inlines = {};

    function push(name) {
        stack.push({children, name});
        children = [];
    }

    function pop() {
        if (!stack.length) {
            throw new SyntaxError('Unexpected `]]` without `@[name[`');
        }
        const {children: prevChildren, name} = stack.pop();
        prevChildren.push(new Block(name, children));
        children = prevChildren;
    }

    function inline(name) {
        return inlines[name] || (inlines[name] = new Inline(name));
    }

    const chunks = text.split(reParse);

    for (let i = 0, count = chunks.length; i < count; ++i) {
        const chunk = chunks[i];
        if (undefined === chunk) {
            continue;
        }

        if (']]' === chunk) {
            pop();
            continue;
        }

        if ('@[' === chunk.substr(0, 2) && chunk.length > 3 && i < count - 1) {
            const name = chunks[++i];
            // `@[name]`, `name`
            switch (chunk.substr(-1)) {
                case '[':
                    push(name);
                    continue;

                case ']':
                    children.push(inline(name));
                    continue;
            }
        }

        if (chunk) {
            children.push(chunk);
        }
    }

    if (stack.length) {
        throw new SyntaxError(`Unexpected end of input without end of blocks: ${
            stack.map(({name}) => `'@[${name}['`).join(', ')
        }`);
    }

    return new RootBlock(children);
};
