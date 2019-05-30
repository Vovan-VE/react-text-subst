import React from 'react';
import Node from './Node';

export default class Block extends Node {
    /**
     * @type {Array<Node|React.ReactNode>}
     */
    children;

    /**
     * @param {string} name
     * @param {Array<Node|React.ReactNode>} children
     */
    constructor(name, children = []) {
        super(name);
        this.children = children;
    }

    /**
     * Render the node
     * @param {function(name: string): (React.ComponentClass|React.ReactNode)} getter
     * @param {React.Key} [key]
     * @return {React.ReactNode}
     */
    render(getter, key) {
        const {name} = this;
        const Component = getter(name);
        if (typeof Component !== 'function') {
            throw new TypeError(`Renderer for '${name}' must be a function`);
        }
        return (
            <Component key={key} name={name}>
                {this.renderChildren(getter)}
            </Component>
        );
    }

    /**
     * Render children nodes
     * @param {function(name: string): (React.ComponentClass|React.ReactNode)} getter
     * @return {React.ReactNode}
     */
    renderChildren(getter) {
        const {children} = this;

        switch (children.length) {
            case 0:
                return null;

            case 1:
                const [child] = children;
                if (child instanceof Node) {
                    return child.render(getter);
                }
                return child;
        }

        return children.map((child, index) => {
            if (child instanceof Node) {
                return child.render(getter, index);
            }
            return child;
        });
    }
}
