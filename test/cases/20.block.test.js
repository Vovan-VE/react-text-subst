import React, {Fragment} from 'react';
import render from '../cases.setup';
import T from '../../src/';

describe('block rendering', () => {
    const C = ({name, children}) => <div data-name={name}>{children}</div>;

    it('empty', () => {
        expect(render(
            <T text=".@[foo[]]." v-foo={C}/>
        )).toBe(render(
            <Fragment>.<C name="foo"/>.</Fragment>
        ));
    });

    it('text', () => {
        expect(render(
            <T text=".@[foo[Lorem ipsum]]." v-foo={C}/>
        )).toBe(render(
            <Fragment>.<C name="foo">Lorem ipsum</C>.</Fragment>
        ));
    });

    it('inline', () => {
        expect(render(
            <T text=".@[foo[Lorem @[bar] ipsum]]." v-foo={C} v-bar={<b>42</b>}/>
        )).toBe(render(
            <Fragment>.<C name="foo">Lorem <b>42</b> ipsum</C>.</Fragment>
        ));
    });

    it('nested', () => {
        expect(render(
            <T text=".@[foo[Lorem @[foo[ipsum]] @[bar[dolor]]]]." v-foo={C} v-bar={C}/>
        )).toBe(render(
            <Fragment>
                .<C name="foo">Lorem <C name="foo">ipsum</C> <C name="bar">dolor</C></C>.
            </Fragment>
        ));
    });
});
