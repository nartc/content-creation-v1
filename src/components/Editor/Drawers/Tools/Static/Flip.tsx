import { ReactComponent as FlipHorizontal } from '@customIcons/flip/flip-horizontal.svg';
import { ReactComponent as FlipVertical } from '@customIcons/flip/flip-vertical.svg';
import { arePropsEqual } from '@utils/arePropsEqual';
import { FlipType } from '@utils/fabric';
import { IToolWithProps, ToolIcon, ToolWrapper } from '@utils/ui';
import React, { FC, memo } from 'react';

interface IFlipToolsProps extends IToolWithProps {
  shouldDisabled: boolean;
}

export const FlipTools: FC<IFlipToolsProps> = memo(({ shouldDisabled, canvasContextDispatcher, canvasHandler }) => {
  const onFlipHandler = (type: FlipType) => () => {
    canvasHandler.flipObject(type);
    canvasContextDispatcher({ type: 'SET_OBJECT', payload: { selectedObject: canvasHandler.activeObject } });
  };

  return (
    <ToolWrapper title={'Flip'}>
      <ToolIcon shouldDisabled={shouldDisabled}
                svgIcon={FlipVertical}
                tooltip={'Flip Vertical'}
                placement={'leftBottom'}
                onClick={onFlipHandler('vertical')}/>
      <ToolIcon shouldDisabled={shouldDisabled}
                svgIcon={FlipHorizontal}
                tooltip={'Flip Horizontal'}
                placement={'leftBottom'}
                onClick={onFlipHandler('horizontal')}/>
    </ToolWrapper>
  );
}, arePropsEqual<IFlipToolsProps>('shouldDisabled'));
