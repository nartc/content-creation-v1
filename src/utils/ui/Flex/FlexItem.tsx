import React, { CSSProperties, FC }   from 'react';
import { FlexAlignSelf, FlexElement } from './FlexBox';

interface IFlexItemProps {
  element?: FlexElement;
  style?: CSSProperties;
  className?: string;
  order?: number;
  flexGrow?: string | number;
  flexShrink?: string | number;
  flexBasis?: string | number;
  flex?: string | number;
  alignSelf?: FlexAlignSelf;
  onClick?: (event: React.MouseEvent<HTMLElement>) => void;
}

export const FlexItem: FC<IFlexItemProps> = props => {
  const { element, className, style, children, onClick, ...flexProps } = props;
  return React.createElement(element as FlexElement, {
    className,
    style: { ...style, ...flexProps },
    onClick
  }, children);
};

FlexItem.defaultProps = {
  element: 'div',
  style: {},
  className: '',
  flex: 1
};
