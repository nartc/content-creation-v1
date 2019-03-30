import { ReactComponent as HorizontalBottom } from '@customIcons/aligning/horizontal-bottom.svg';
import { ReactComponent as HorizontalCenter } from '@customIcons/aligning/horizontal-center.svg';
import { ReactComponent as HorizontalTop } from '@customIcons/aligning/horizontal-top.svg';
import { ReactComponent as VerticalCenter } from '@customIcons/aligning/vertical-center.svg';
import { ReactComponent as VerticalLeft } from '@customIcons/aligning/vertical-left.svg';
import { ReactComponent as VerticalRight, } from '@customIcons/aligning/vertical-right.svg';
import { arePropsEqual } from '@utils/arePropsEqual';
import { AlignmentType } from '@utils/fabric';
import { IToolWithProps, ToolIcon, ToolWrapper } from '@utils/ui';
import React, { FC, memo } from 'react';

interface IAlignmentToolsProps extends IToolWithProps {
  shouldDisabled: boolean;
}

export const AlignmentTools: FC<IAlignmentToolsProps> = memo(({ shouldDisabled, canvasHandler, canvasContextDispatcher }) => {
  const onAlignmentHandler = (type: AlignmentType) => () => {
    canvasHandler.alignObject(type);
    canvasContextDispatcher({ type: 'SET_OBJECT', payload: { selectedObject: canvasHandler.activeObject } });
  };

  return (
    <ToolWrapper title={'Alignment'}>
      <ToolIcon shouldDisabled={shouldDisabled}
                svgIcon={VerticalLeft}
                tooltip={'Align Left'}
                onClick={onAlignmentHandler('left')}/>
      <ToolIcon shouldDisabled={shouldDisabled}
                svgIcon={VerticalCenter}
                tooltip={'Align Vertically'}
                onClick={onAlignmentHandler('vertical')}/>
      <ToolIcon shouldDisabled={shouldDisabled}
                svgIcon={VerticalRight}
                tooltip={'Align Right'}
                onClick={onAlignmentHandler('right')}/>
      <ToolIcon shouldDisabled={shouldDisabled}
                svgIcon={HorizontalTop}
                tooltip={'Align Top'}
                onClick={onAlignmentHandler('top')}/>
      <ToolIcon shouldDisabled={shouldDisabled}
                svgIcon={HorizontalCenter}
                tooltip={'Align Horizontally'}
                placement={'leftBottom'}
                onClick={onAlignmentHandler('horizontal')}/>
      <ToolIcon shouldDisabled={shouldDisabled}
                svgIcon={HorizontalBottom}
                tooltip={'Align Bottom'}
                placement={'leftBottom'}
                onClick={onAlignmentHandler('bottom')}/>
    </ToolWrapper>
  );
}, arePropsEqual<IAlignmentToolsProps>('shouldDisabled'));
