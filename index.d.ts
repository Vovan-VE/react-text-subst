import * as React from 'react';
import * as PropTypes from 'prop-types';

interface InlineItemComponentProps {
    name: string;
}

interface BlockItemComponentProps extends InlineItemComponentProps {
    children: React.ReactNode;
}

type InlineItemValue = React.ComponentType<InlineItemComponentProps> | React.ReactNode;
type BlockItemValue = React.ComponentType<BlockItemComponentProps>;
type ItemValue = InlineItemValue | BlockItemValue;

interface TextSubstProps {
    children?: string | null | undefined;
    [key: string]: ItemValue;
}

declare class TextSubst extends React.Component<TextSubstProps, {}> {
    static propTypes: {
        children?: PropTypes.Validator<string>;
        [key: string]: PropTypes.Validator<ItemValue>;
    };
    render(): React.ReactNode;
}

export default TextSubst;
