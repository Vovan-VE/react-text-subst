import compile from '../../src/lib/compile';
import Block from '../../src/lib/Block';
import Inline from '../../src/lib/Inline';
import RootBlock from '../../src/lib/RootBlock';

describe('compile success', () => {
    it('text empty', () => {
        expect(compile('')).toEqual(
            new RootBlock([])
        );
    });

    it('text only', () => {
        expect(compile('foo bar')).toEqual(
            new RootBlock(['foo bar'])
        );
    });

    describe('inline', () => {
        it('inline only', () => {
            expect(compile('@[foo]')).toEqual(
                new RootBlock([new Inline('foo')])
            );
        });

        it('inline text before', () => {
            expect(compile('lorem @[foo]')).toEqual(
                new RootBlock([
                    'lorem ',
                    new Inline('foo'),
                ])
            );
        });

        it('inline text after', () => {
            expect(compile('@[foo] ipsum')).toEqual(
                new RootBlock([
                    new Inline('foo'),
                    ' ipsum',
                ])
            );
        });

        it('inline in text', () => {
            expect(compile('lorem @[foo] ipsum')).toEqual(
                new RootBlock([
                    'lorem ',
                    new Inline('foo'),
                    ' ipsum',
                ])
            );
        });

        it('inline many', () => {
            expect(compile('lorem @[foo] ipsum @[bar] dolor')).toEqual(
                new RootBlock([
                    'lorem ',
                    new Inline('foo'),
                    ' ipsum ',
                    new Inline('bar'),
                    ' dolor',
                ])
            );
        });

        it('inline duplicate', () => {
            const compiled = compile('@[foo] lorem @[foo]');

            expect(compiled).toEqual(
                new RootBlock([
                    new Inline('foo'),
                    ' lorem ',
                    new Inline('foo'),
                ])
            );

            const {0: foo1, 2: foo2} = compiled.children;

            expect(foo1).toBe(foo2);
        });
    });

    describe('block', () => {
        it('block only empty', () => {
            expect(compile('@[foo[]]')).toEqual(
                new RootBlock([new Block('foo')])
            );
        });

        it('block only with text', () => {
            expect(compile('@[foo[Lorem ipsum]]')).toEqual(
                new RootBlock([
                    new Block('foo', [
                        'Lorem ipsum',
                    ]),
                ])
            );
        });

        it('block only with inline only', () => {
            expect(compile('@[foo[@[bar]]]')).toEqual(
                new RootBlock([
                    new Block('foo', [
                        new Inline('bar'),
                    ]),
                ])
            );
        });

        it('block only', () => {
            expect(compile('@[foo[Lorem @[bar] ipsum]]')).toEqual(
                new RootBlock([
                    new Block('foo', [
                        'Lorem ',
                        new Inline('bar'),
                        ' ipsum',
                    ]),
                ])
            );
        });

        it('block text before', () => {
            expect(compile('Lorem @[foo[ipsum]]')).toEqual(
                new RootBlock([
                    'Lorem ',
                    new Block('foo', [
                        'ipsum',
                    ]),
                ])
            );
        });

        it('block text after', () => {
            expect(compile('@[foo[Lorem]] ipsum')).toEqual(
                new RootBlock([
                    new Block('foo', [
                        'Lorem',
                    ]),
                    ' ipsum',
                ])
            );
        });

        it('block in text', () => {
            expect(compile('Lorem @[foo[ipsum]] dolor')).toEqual(
                new RootBlock([
                    'Lorem ',
                    new Block('foo', [
                        'ipsum',
                    ]),
                    ' dolor',
                ])
            );
        });

        it('block nested', () => {
            expect(compile('@[foo[Lorem @[bar[ipsum]] dolor @[empty[]] sit]]')).toEqual(
                new RootBlock([
                    new Block('foo', [
                        'Lorem ',
                        new Block('bar', [
                            'ipsum'
                        ]),
                        ' dolor ',
                        new Block('empty'),
                        ' sit',
                    ]),
                ])
            );
        });

        it('block nested only', () => {
            expect(compile('@[foo[@[bar[@[empty[]]]]]]')).toEqual(
                new RootBlock([
                    new Block('foo', [
                        new Block('bar', [
                            new Block('empty'),
                        ]),
                    ]),
                ])
            );
        });

        it('block duplicate', () => {
            expect(compile('@[foo[@[foo[]]@[foo[]]]]')).toEqual(
                new RootBlock([
                    new Block('foo', [
                        new Block('foo'),
                        new Block('foo'),
                    ]),
                ])
            );
        });
    });

    describe('syntax errors', () => {
        it('unexpected end of block', () => {
            expect(() => compile('text ]] text'))
                .toThrow(new SyntaxError('Unexpected `]]` without `@[name[`'));
        });

        it('unclosed blocks', () => {
            expect(() => compile('text @[foo[ text @[bar[@[baz[ text'))
                .toThrow(new SyntaxError(
                    "Unexpected end of input without end of blocks: '@[foo[', '@[bar[', '@[baz['"
                ));
        });
    });
});
