import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import memoizeOne from 'memoize-one';
import compile from './compile';

export default class TextSubst extends PureComponent {
    static propTypes = {
        children: PropTypes.string,
    };

    /**
     * @param {string} text
     * @return {RootBlock}
     */
    _compile = memoizeOne(compile);

    /**
     *
     * @param name
     * @return {React.ComponentClass|React.ReactNode}
     */
    _getter = name => this.props[name];

    render() {
        const {children} = this.props;
        return (
            children
                ? this._compile(children).render(this._getter)
                : null
        );
    }
}
