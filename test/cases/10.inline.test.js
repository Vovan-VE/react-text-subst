import React from 'react';
import render from '../cases.setup';
import T from '../../src/';

describe('inline rendering', () => {
    it('null', () => {
        expect(render(
            <T foo={null}>.@[foo].</T>
        )).toBe(render(
            <>..</>
        ));
    });

    it('number', () => {
        expect(render(
            <T foo={42}>.@[foo].</T>
        )).toBe(render(
            <>.42.</>
        ));
    });

    it('string', () => {
        expect(render(
            <T foo={'lorem'}>.@[foo].</T>
        )).toBe(render(
            <>.lorem.</>
        ));
    });

    it('string[]', () => {
        expect(render(
            <T foo={['lorem', 'ipsum', 'dolor']}>.@[foo].</T>
        )).toBe(render(
            <>.loremipsumdolor.</>
        ));
    });

    it('undefined', () => {
        expect(render(
            <T foo={undefined}>.@[foo].@[bar].</T>
        )).toBe(render(
            <>...</>
        ));
    });

    it('element', () => {
        expect(render(
            <T foo={<span>lorem</span>}>.@[foo].</T>
        )).toBe(render(
            <>.<span>lorem</span>.</>
        ));
    });

    it('component', () => {
        expect(render(
            <T foo={({name}) => <span>value of "{name}"</span>}>.@[foo].</T>
        )).toBe(render(
            <>.<span>value of "foo"</span>.</>
        ));
    });

    it('component duplicate', () => {
        const C = ({name}) => <span>"{name}"</span>;
        expect(render(
            <T foo={C} bar={C}>.@[foo].@[bar].</T>
        )).toBe(render(
            <>.<span>"foo"</span>.<span>"bar"</span>.</>
        ));
    });
});
