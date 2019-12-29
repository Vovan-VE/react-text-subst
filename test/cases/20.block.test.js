import React from 'react';
import render from '../cases.setup';
import T from '../../src/';

describe('block rendering', () => {
    const C = ({name, children}) => <div data-name={name}>{children}</div>;

    it('empty', () => {
        expect(render(
            <T foo={C}>.@[foo[]].</T>
        )).toBe(render(
            <>.<C name="foo"/>.</>
        ));
    });

    it('text', () => {
        expect(render(
            <T foo={C}>.@[foo[Lorem ipsum]].</T>
        )).toBe(render(
            <>.<C name="foo">Lorem ipsum</C>.</>
        ));
    });

    it('inline', () => {
        expect(render(
            <T foo={C} bar={<b>42</b>}>.@[foo[Lorem @[bar] ipsum]].</T>
        )).toBe(render(
            <>.<C name="foo">Lorem <b>42</b> ipsum</C>.</>
        ));
    });

    it('nested', () => {
        expect(render(
            <T foo={C} bar={C}>.@[foo[Lorem @[foo[ipsum]] @[bar[dolor]]]].</T>
        )).toBe(render(
            <>
                .<C name="foo">Lorem <C name="foo">ipsum</C> <C name="bar">dolor</C></C>.
            </>
        ));
    });

    it('node only', () => {
        expect(render(
            <T foo={C}>@[foo[Lorem ipsum]]</T>
        )).toBe(render(
            <C name="foo">Lorem ipsum</C>
        ));
    });

    it('bad block', () => {
        expect(() => render(
            <T foo={<div>fail</div>}>.@[foo[Lorem ipsum]].</T>
        )).toThrow(new TypeError("Renderer for 'foo' must be a function"));
    });
});
