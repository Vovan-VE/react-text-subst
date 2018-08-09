import React from "react";

import Block from './Block';

export default class RootBlock extends Block {
    constructor(children) {
        super(':root', children);
    }

    render(getter) {
        return this.renderChildren(getter);
    }
};
