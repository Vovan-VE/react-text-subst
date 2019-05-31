Changelog
=========

1.0.0-beta.1
-----


*   **BC BREAK**: API. The property `text` replaced with children
    and properties for values now must be without `v-` prefix as is:

    ```jsx
    // old
    <TextSubst
        text="lorem @[foo] ipsum"
        v-foo={42}
    />

    // new
    <TextSubst foo={42}>
        lorem @[foo] ipsum
    </TextSubst>
    ```

    > Notice: now you cannot use React specific props like `key`
    or `ref` for values.

*   **BC BREAK**: Update peer dependency for `react` to `^16.3`.

*   **BC BREAK**: Drop Node v6 support.

*   Fix: move `prop-types` to `peerDependencies`.
