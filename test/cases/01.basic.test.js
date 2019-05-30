import React, {Fragment} from 'react';
import render from '../cases.setup';
import T from '../../src/';

describe('basic rendering', () => {
    it('empty text', () => {
        expect(render(<T/>))
            .toBe(render(<Fragment/>));
    });

    it('text only', () => {
        expect(render(<T>Lorem ipsum</T>))
            .toBe(render(<Fragment>Lorem ipsum</Fragment>));
    });

    it('simple cases', () => {
        expect(render(
            <T
                foo={<b>Foo</b>}
                bar={({children}) => <i>{children}</i>}
            >
                Lorem @[foo] ipsum @[bar[dolor]] sit
            </T>
        )).toBe(render(
            <Fragment>Lorem <b>Foo</b> ipsum <i>dolor</i> sit</Fragment>
        ));
    });
});
