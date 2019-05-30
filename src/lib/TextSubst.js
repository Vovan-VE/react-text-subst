import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import memoizeOne from 'memoize-one';
import compile from './compile';

export default class TextSubst extends PureComponent {
    static propTypes = {
        text: PropTypes.string.isRequired,
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
    _getter = name => this.props[`v-${name}`];

    render() {
        const {text} = this.props;
        return this._compile(text).render(this._getter);
    }
}
