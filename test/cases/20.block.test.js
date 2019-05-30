import React, {Fragment} from 'react';
import render from '../cases.setup';
import T from '../../src/';

describe('block rendering', () => {
    const C = ({name, children}) => <div data-name={name}>{children}</div>;

    it('empty', () => {
        expect(render(
            <T foo={C}>.@[foo[]].</T>
        )).toBe(render(
            <Fragment>.<C name="foo"/>.</Fragment>
        ));
    });

    it('text', () => {
        expect(render(
            <T foo={C}>.@[foo[Lorem ipsum]].</T>
        )).toBe(render(
            <Fragment>.<C name="foo">Lorem ipsum</C>.</Fragment>
        ));
    });

    it('inline', () => {
        expect(render(
            <T foo={C} bar={<b>42</b>}>.@[foo[Lorem @[bar] ipsum]].</T>
        )).toBe(render(
            <Fragment>.<C name="foo">Lorem <b>42</b> ipsum</C>.</Fragment>
        ));
    });

    it('nested', () => {
        expect(render(
            <T foo={C} bar={C}>.@[foo[Lorem @[foo[ipsum]] @[bar[dolor]]]].</T>
        )).toBe(render(
            <Fragment>
                .<C name="foo">Lorem <C name="foo">ipsum</C> <C name="bar">dolor</C></C>.
            </Fragment>
        ));
    });
});
