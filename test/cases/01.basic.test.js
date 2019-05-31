import React from 'react';
import render from '../cases.setup';
import T from '../../src/';

describe('basic rendering', () => {
    it('empty text', () => {
        expect(render(<T/>))
            .toBe(render(<></>));
    });

    it('text only', () => {
        expect(render(<T>Lorem ipsum</T>))
            .toBe(render(<>Lorem ipsum</>));
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
            <>Lorem <b>Foo</b> ipsum <i>dolor</i> sit</>
        ));
    });
});
