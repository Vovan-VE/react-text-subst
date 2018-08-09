import React, {Component, Fragment} from 'react';
import PropTypes from 'prop-types';

class Node {
    constructor(name) {
        this.name = name;
    }

    render(getter, key) {
        return null;
    }
}

class Inline extends Node {
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
}

class Block extends Node {
    constructor(name, children = []) {
        super(name);
        this.setChildren(children);
    }

    setChildren(children) {
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
}

const reParse = /(@\[(\w+)[[\]]|]])/;

function compile(text) {
    let children = [];
    const stack = [];
    const inlines = {};

    function push(name) {
        stack.push({children, name});
        children = [];
    }

    function pop() {
        if (!stack.length) {
            throw new SyntaxError('Redundant `]]` without `@[name[`');
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
        throw new SyntaxError(`Unexpected end without end of block: ${
            stack.map(({name}) => `'@[${name}['`).join(', ')
        }`);
    }

    return new Block('/', children);
}

export default class TextSubst extends Component {
    static propTypes = {
        text: PropTypes.string.isRequired,
    };

    constructor(props) {
        super(props);

        this._compile(props.text);

        this._getter = this._getter.bind(this);
    }

    componentDidUpdate(prevProps) {
        const {text} = this.props;
        if (text !== prevProps.text) {
            this._compile(text);
        }
    }

    _compile(text) {
        this._block = compile(text);
    }

    _getter(name) {
        return this.props[`v-${name}`];
    }

    render() {
        return <Fragment>{this._block.renderChildren(this._getter)}</Fragment>;
    }
};
