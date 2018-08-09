import React, {Component, Fragment} from 'react';
import PropTypes from 'prop-types';
import memoizeOne from 'memoize-one';

import compile from './compile';

export default class TextSubst extends Component {
    static propTypes = {
        text: PropTypes.string.isRequired,
    };

    constructor(props) {
        super(props);

        this.getter = this.getter.bind(this);
        this.compile = memoizeOne(compile);
    }

    getter(name) {
        return this.props[`v-${name}`];
    }

    render() {
        const {text} = this.props;
        const block = this.compile(text);
        return <Fragment>{block.renderChildren(this._getter)}</Fragment>;
    }
};
