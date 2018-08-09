react-text-subst
================

[![Package Version](https://img.shields.io/npm/v/react-text-subst.svg)](https://www.npmjs.com/package/react-text-subst)

How will you add i18n support in following cases?

```js
return <span>Hello <span>{username}</span>!</span>;
```

```js
return <span>
    By clicking “Sign up”, you agree
    to our <a href="...">terms of service</a> and...
</span>;
```

Sure, you just can split texts in parts, but that parts would be translated not properly.

Here is a solution:

```js
return <TextSubst
    text="Hello @[user]!"
    v-user={<span className="...">{username}</span>}
/>;
```

```js
return <TextSubst
    text="By clicking “Sign up”, you agree to our @[link[terms of service]] and..."
    v-link={({children}) => <a href="...">{children}</a>}
/>;
```

Now you can simply add i18n to patterns and translate them.

Pattern syntax
--------------

Pattern text has following special tokens:

*   `@[foo]` - inline node. Render corresponding standalone value, element or component.
*   `@[foo[` - start block node. Render a component wrapped around block's content.
*   `]]` - end corresponding block node.

Nodes
-----

So, there are few types of nodes. Nodes of any type can repeat or share its' names - everything
is up to you.

### Inline `@[foo]`

Inline node can render anything what React can render as a node, or component.
The last will receive following property:

*   `name` - corresponding node name (`foo` in example).

```js
return <TextSubst
    text="foo @[bar] lol @[baz]@[qux]."
    v-bar={something}
    v-baz={<b>{something}</b>}
    v-qux={({name}) => <b>value of {name}</b>}
/>
// <Fragment>
//     foo {something} lol <b>{something}</b><b>value of qux</b>
// </Fragment>
```

### Block `@[foo[...]]`

Block node can only render a component. It will receive following properties:

*   `name` - corresponding node name (`foo` in example).
*   `children` - rendered content of the block.

Blocks can be nested.

```js
return <TextSubst
    text="lorem @[b[ipsum @[i[dolor]] sit]] amet @[i[consectep@[b[ture]]]]"
    v-b={({children}) => <b>{children}</b>}
    v-i={({children}) => <i>{children}</i>}
/>;
// <Fragment>
//     lorem <b>ipsum <i>dolor</i> sit</b> amet <i>consectep<b>ture</b></i>
// </Fragment>
```

```js
return <TextSubst
    text="lorem @[foo[ipsum @[foo[dolor]] sit]] amet"
    v-foo={({children}) => <span>{children}</span>}
/>;
// <Fragment>
//     lorem <span>ipsum <span>dolor</span> sit</span> amet
// </Fragment>
```

```js
const Link = ({name, children}) => <a href={URL[name]}>{children}</a>;
return <TextSubst
    text="lorem @[foo[ipsum]] dolor @[bar[sit]] amet"
    v-foo={Link}
    v-bar={Link}
/>;
// <Fragment>
//     lorem <a href={URL.foo}>ipsum</a> dolor <a href={URL.bar}>sit</a> amet
// </Fragment>
```

API
---

### Properties

*   `text` - pattern string to render;
*   `v-foo` - value, element or component to render nodes with name `foo`.

License
-------

This package is under [MIT License][mit]


[mit]: https://opensource.org/licenses/MIT
