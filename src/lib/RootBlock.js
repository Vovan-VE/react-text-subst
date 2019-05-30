import React from 'react';
import Block from './Block';

export default class RootBlock extends Block {
    /**
     * @param {Array<Node|React.ReactNode>} children
     */
    constructor(children) {
        super(':root', children);
    }

    /**
     * Render the node
     * @param {function(name: string): (React.ComponentClass|React.ReactNode)} getter
     * @param {React.Key} [key]
     * @return {React.ReactNode}
     */
    render(getter, key) {
        return this.renderChildren(getter);
    }
}
