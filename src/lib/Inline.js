import React, {Fragment} from 'react';
import Node from './Node';

export default class Inline extends Node {
    /**
     * Render the node
     * @param {function(name: string): (React.ComponentClass|React.ReactNode)} getter
     * @param {React.Key} [key]
     * @return {React.ReactNode}
     */
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
}
