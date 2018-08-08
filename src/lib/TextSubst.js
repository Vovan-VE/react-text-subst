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

/**
 * Wrap text substitutions with React nodes
 *
 * Eexamples:
 *
 * ```js
 * <TextSubst
 *     text={i18n("Hello, @[user]!")}
 *     v-user={<b>{username}</b>}
 * />
 *
 * <TextSubst
 *     text={i18n("I agree with @[link[Terms of service]].")}
 *     v-link={({children}) => <a href="">{children}</a>}
 * />
 * ```
 *
 * Profit: static text string can be translated at once with i18n.
 *
 * ### Props
 *
 * *   `text` string - source text to render. Patterns:
 *     o   `@[name]` - inline node with name `name`
 *     o   `@[name[` - begin block node with name `name`
 *     o   `]]` - end innermost unclosed block node
 * *   `v-*` - value, react element or react component to render nodes with corresponding name.
 *
 * ### Nodes
 *
 * *   Inline `@[name]` allows you to render a node like a value of variable. Inline node with same name can
 *     be repeated any number of times in any allowed place.
 *     Property `v-name` can be a value, react element or react component receiving following props:
 *     o   `name` string
 *
 * *   Block `@[name[...]]` allows you to wrap a content with an element. Content `...` can contain nested
 *     blocks and inline nodes with no restriction.
 *     Property `v-name` must be a component receiving following props:
 *     o   `name` string
 *     o   `children`
 *
 * Examples:
 *
 * ```js
 * <TextSubst
 *     text="Text @[foo] text @[bar] text @[baz] text"
 *     v-foo={something}
 *     v-bar={<b>{something}</b>}
 *     v-baz={({name}) => <b>{values[name]}</b>}
 * />
 * // similar to:
 * // <Fragment>Text {something} text <b>{something}</b> text <b>{values.bar}</b> text</Fragment>
 *
 * <TextSubst
 *     text={"Normal @[b[Bold @[i[Bold Italic]] Bold]] Normal @[i[Italic]]"}
 *     v-b={({children}) => <b>{children}</b>}
 *     v-i={({children}) => <i>{children}</i>}
 * />
 * // similar to:
 * // <Fragment>Normal <b>Bold <i>Bold Italic</i> Bold</b> Normal <i>Italic</i></Fragment>
 *
 * const URLS = {
 *     foo: '/foo/',
 *     bar: '/bar/',
 * };
 * const Link = ({name, children}) => <a href={URLS[name]}>{children}</a>;
 * <TextSubst
 *     text="Text @[foo[text text]] text @[bar[text text]] text"
 *     v-foo={Link}
 *     v-bar={Link}
 * />
 * // similar to:
 * // <Fragment>Text <a href="/foo/">text text</a> text <a href="/bar/">text text</a> text</Fragment>
 * ```
 */
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
}
