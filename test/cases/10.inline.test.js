import React, {Fragment} from 'react';
import render from '../cases.setup';
import T from '../../src/';

describe('inline rendering', () => {
    it('null', () => {
        expect(render(
            <T text=".@[foo]." v-foo={null}/>
        )).toBe(render(
            <Fragment>..</Fragment>
        ));
    });

    it('number', () => {
        expect(render(
            <T text=".@[foo]." v-foo={42}/>
        )).toBe(render(
            <Fragment>.42.</Fragment>
        ));
    });

    it('string', () => {
        expect(render(
            <T text=".@[foo]." v-foo={'lorem'}/>
        )).toBe(render(
            <Fragment>.lorem.</Fragment>
        ));
    });

    it('string[]', () => {
        expect(render(
            <T text=".@[foo]." v-foo={['lorem', 'ipsum', 'dolor']}/>
        )).toBe(render(
            <Fragment>.loremipsumdolor.</Fragment>
        ));
    });

    it('undefined', () => {
        expect(render(
            <T text=".@[foo].@[bar]." v-foo={undefined}/>
        )).toBe(render(
            <Fragment>...</Fragment>
        ));
    });

    it('element', () => {
        expect(render(
            <T text=".@[foo]." v-foo={<span>lorem</span>}/>
        )).toBe(render(
            <Fragment>.<span>lorem</span>.</Fragment>
        ));
    });

    it('component', () => {
        expect(render(
            <T text=".@[foo]." v-foo={({name}) => <span>value of "{name}"</span>}/>
        )).toBe(render(
            <Fragment>.<span>value of "foo"</span>.</Fragment>
        ));
    });

    it('component duplicate', () => {
        const C = ({name}) => <span>"{name}"</span>;
        expect(render(
            <T text=".@[foo].@[bar]." v-foo={C} v-bar={C}/>
        )).toBe(render(
            <Fragment>.<span>"foo"</span>.<span>"bar"</span>.</Fragment>
        ));
    });
});
