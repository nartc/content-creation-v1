import { arePropsEqual } from '@utils/arePropsEqual';
import { FullWidthSlider, IToolWithProps, ToolWrapper } from '@utils/ui';
import { Typography } from 'antd';
import { SliderValue } from 'antd/lib/slider';
import React, { FC, memo } from 'react';

interface IOpacityToolProps extends IToolWithProps {
  opacity: number;
}

export const OpacityTool: FC<IOpacityToolProps> = memo(({ opacity, isActiveSelection, canvasContextDispatcher, canvasHandler }) => {
  const onOpacityChangeHandler = (value: SliderValue) => {
    canvasHandler.set('opacity', value, isActiveSelection);
    canvasContextDispatcher({ type: 'SET_OBJECT', payload: { selectedObject: canvasHandler.activeObject } });
    if (isActiveSelection) {
      canvasContextDispatcher({ type: 'SET_OBJECTS', payload: { selectedObjects: canvasHandler.activeObjects } });
    }
  };

  return (
    <ToolWrapper title={'Opacity'}>
      <FullWidthSlider max={1}
                       min={0}
                       step={0.01}
                       value={opacity}
                       onChange={onOpacityChangeHandler}
                       tipFormatter={null}/>
      <Typography.Text>{`${(opacity * 100).toFixed(0)}%`}</Typography.Text>
    </ToolWrapper>
  );
}, arePropsEqual<IOpacityToolProps>('opacity'));
