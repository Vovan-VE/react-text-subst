import React, {Fragment} from 'react';
import render from '../cases.setup';
import T from '../../src/';

describe('basic rendering', () => {
    it('empty text', () => {
        expect(render(<T text=""/>))
            .toBe(render(<Fragment/>));
    });

    it('text only', () => {
        expect(render(<T text="Lorem ipsum"/>))
            .toBe(render(<Fragment>Lorem ipsum</Fragment>));
    });

    it('simple cases', () => {
        expect(render(
            <T
                text="Lorem @[foo] ipsum @[bar[dolor]] sit"
                v-foo={<b>Foo</b>}
                v-bar={({children}) => <i>{children}</i>}
            />
        )).toBe(render(
            <Fragment>Lorem <b>Foo</b> ipsum <i>dolor</i> sit</Fragment>
        ));
    });
});
