react-text-subst
================

[![Package Version](https://img.shields.io/npm/v/react-text-subst.svg)](https://www.npmjs.com/package/react-text-subst)
[![Build Status](https://travis-ci.org/Vovan-VE/react-text-subst.svg)](https://travis-ci.org/Vovan-VE/react-text-subst)

How will you add i18n support in following cases?

```jsx
<span>Hello <span>{username}</span>!</span>
```

```jsx
return <span>
    By clicking “Sign up”, you agree
    to our <a href="...">terms of service</a> and...
</span>;
```

Sure, you just can split texts in parts, but that parts would be translated not properly.

Here is a solution:

```jsx
import TextSubst from 'react-text-subst';

return (
    <TextSubst user={<span>{username}</span>}>
        Hello @[user]!
    </TextSubst>
);
```

```jsx
<TextSubst link={({children}) => <a href="...">{children}</a>}>
    By clicking “Sign up”, you agree to our @[link[terms of service]] and...
</TextSubst>
```

Now you can simply add i18n to patterns and translate them.

Install
-------

```sh
npm i --save react-text-subst
```

Pattern syntax
--------------

Pattern text has following special tokens:

*   `@[foo]` - inline node. Render corresponding standalone value, element or component.
*   `@[foo[` - start block node. Render a component wrapped around block's content.
*   `]]` - end corresponding block node.

> Notice: Since React has special props `key` and `ref`, you shouldn't use such names
in pattern.

Nodes
-----

So, there are few types of nodes. Nodes of any type can repeat or share its' names - everything
is up to you.

### Inline `@[foo]`

Inline node can render anything what React can render as a node, or component.
The last will receive following property:

*   `name` - corresponding node name (`foo` in example).

```jsx
<TextSubst
    bar={something}
    baz={<b>{something}</b>}
    qux={({name}) => <b>value of {name}</b>}
>
    foo @[bar] lol @[baz]@[qux].
</TextSubst>
// <>
//     foo {something} lol <b>{something}</b><b>value of qux</b>
// </>
```

### Block `@[foo[...]]`

Block node can only render a component. It will receive following properties:

*   `name` - corresponding node name (`foo` in example).
*   `children` - rendered content of the block.

Blocks can be nested.

```jsx
<TextSubst
    b={({children}) => <b>{children}</b>}
    i={({children}) => <i>{children}</i>}
>
    lorem @[b[ipsum @[i[dolor]] sit]] amet @[i[consectep@[b[ture]]]]
</TextSubst>
// <>
//     lorem <b>ipsum <i>dolor</i> sit</b> amet <i>consectep<b>ture</b></i>
// </>
```

```jsx
<TextSubst foo={({children}) => <span>{children}</span>}>
    lorem @[foo[ipsum @[foo[dolor]] sit]] amet
</TextSubst>
// <>
//     lorem <span>ipsum <span>dolor</span> sit</span> amet
// </>
```

```jsx
const Link = ({name, children}) => <a href={URL[name]}>{children}</a>;
return (
    <TextSubst foo={Link} bar={Link}>
        lorem @[foo[ipsum]] dolor @[bar[sit]] amet
    </TextSubst>
);
// <>
//     lorem <a href={URL.foo}>ipsum</a> dolor <a href={URL.bar}>sit</a> amet
// </>
```

API
---

### Properties

*   `children` - pattern string to render, only single string is acceptable:

    ```jsx
    <TextSubst>Lorem ipsum dolor</TextSubst>
    <TextSubst>{'Lorem ipsum dolor'}</TextSubst>
    <TextSubst>{i18n('Lorem ipsum dolor')}</TextSubst>
    ```

*   `...` rest - value, element or component to render nodes with corresponding
    name.

    > Notice: You cannot use React specific props like `key` or `ref` for values.

License
-------

This package is under [MIT License][mit]


[mit]: https://opensource.org/licenses/MIT
