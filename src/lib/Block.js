import React from "react";

import Node from './Node';

export default class Block extends Node {
    constructor(name, children = []) {
        super(name);
        this.children = children;
    }

    render(getter, key) {
        const {name} = this;
        const value = getter(name);
        if (typeof value !== 'function') {
            throw new TypeError(`Renderer for '${name}' must be a function`);
        }
        const children = this.renderChildren(getter);
        const Component = value;
        return <Component key={key} name={name}>{children}</Component>;
    }

    renderChildren(getter) {
        const {children} = this;

        switch (children.length) {
            case 0:
                return null;

            case 1:
                const child = children[0];
                if (child instanceof Node) {
                    return child.render(getter);
                }
                return child;
        }

        return this.children.map((child, index) => {
            if (child instanceof Node) {
                return child.render(getter, index);
            }
            return child;
        });
    }
};
