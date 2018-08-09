import React, {Fragment} from "react";

import Node from './Node';

export default class Inline extends Node {
    constructor(name) {
        super(name);
    }

    render(getter, key) {
        const {name} = this;
        const value = getter(name);
        if (!value) {
            return null;
        }
        if (typeof value === 'function') {
            const Component = value;
            return <Component key={key} name={name}/>;
        }
        if (undefined !== key && typeof value === 'object') {
            return <Fragment key={key}>{value}</Fragment>;
        }
        return value;
    }
};
