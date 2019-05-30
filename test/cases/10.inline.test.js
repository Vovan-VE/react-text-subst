import React, {Fragment} from 'react';
import render from '../cases.setup';
import T from '../../src/';

describe('inline rendering', () => {
    it('null', () => {
        expect(render(
            <T foo={null}>.@[foo].</T>
        )).toBe(render(
            <Fragment>..</Fragment>
        ));
    });

    it('number', () => {
        expect(render(
            <T foo={42}>.@[foo].</T>
        )).toBe(render(
            <Fragment>.42.</Fragment>
        ));
    });

    it('string', () => {
        expect(render(
            <T foo={'lorem'}>.@[foo].</T>
        )).toBe(render(
            <Fragment>.lorem.</Fragment>
        ));
    });

    it('string[]', () => {
        expect(render(
            <T foo={['lorem', 'ipsum', 'dolor']}>.@[foo].</T>
        )).toBe(render(
            <Fragment>.loremipsumdolor.</Fragment>
        ));
    });

    it('undefined', () => {
        expect(render(
            <T foo={undefined}>.@[foo].@[bar].</T>
        )).toBe(render(
            <Fragment>...</Fragment>
        ));
    });

    it('element', () => {
        expect(render(
            <T foo={<span>lorem</span>}>.@[foo].</T>
        )).toBe(render(
            <Fragment>.<span>lorem</span>.</Fragment>
        ));
    });

    it('component', () => {
        expect(render(
            <T foo={({name}) => <span>value of "{name}"</span>}>.@[foo].</T>
        )).toBe(render(
            <Fragment>.<span>value of "foo"</span>.</Fragment>
        ));
    });

    it('component duplicate', () => {
        const C = ({name}) => <span>"{name}"</span>;
        expect(render(
            <T foo={C} bar={C}>.@[foo].@[bar].</T>
        )).toBe(render(
            <Fragment>.<span>"foo"</span>.<span>"bar"</span>.</Fragment>
        ));
    });
});
