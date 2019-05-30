Changelog
=========

0.1.0 (dev)
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

*   **BC BREAK**: Update peer dependency for `react` to `^16.3`.
