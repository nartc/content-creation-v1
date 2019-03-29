import React, { CSSProperties, FC } from 'react';

export type FlexElement = 'article' | 'aside' | 'div' | 'figure' | 'footer' | 'header' | 'main' | 'nav' | 'section';
export type FlexJustifyContent =
  'center'
  | 'flex-end'
  | 'flex-start'
  | 'space-around'
  | 'space-between'
  | 'space-evenly';
export type FlexAlignItems = 'baseline' | 'center' | 'flex-end' | 'flex-start' | 'stretch';
export type FlexAlignContent = Exclude<FlexAlignItems, 'baseline'> & 'space-around' | 'space-between';
export type FlexAlignSelf = FlexAlignItems;

interface IFlexBoxProps {
  element?: FlexElement;
  style?: CSSProperties;
  className?: string;
  display?: 'flex' | 'inline-flex';
  flexDirection?: 'column' | 'row' | 'column-reverse' | 'row-reverse';
  flexWrap?: 'nowrap' | 'wrap-reverse' | 'wrap';
  flexFlow?: string;
  justifyContent?: FlexJustifyContent;
  alignItems?: FlexAlignItems;
  alignContent?: FlexAlignContent;
  order?: number;
  flexGrow?: string | number;
  flexShrink?: string | number;
  flexBasis?: string | number;
  flex?: string | number;
  alignSelf?: FlexAlignSelf;
}

export const FlexBox: FC<IFlexBoxProps> = props => {
  const { element, className, style, children, ...flexProps } = props;
  return React.createElement(element as FlexElement, { className, style: { ...style, ...flexProps } }, children);
};

FlexBox.defaultProps = {
  element: 'div',
  display: 'flex',
  style: {},
  className: ''
};
