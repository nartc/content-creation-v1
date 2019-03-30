import { arePropsEqual } from '@utils/arePropsEqual';
import { IToolWithProps, ToolWrapper } from '@utils/ui';
import { Button, Popover } from 'antd';
import React, { FC, memo } from 'react';
import { ColorResult, SketchPicker } from 'react-color';

interface IFillToolProps extends IToolWithProps {
  fill: string;
}

export const FillTool: FC<IFillToolProps> = memo(({ fill, canvasContextDispatcher, canvasHandler, isActiveSelection }) => {
  const onFillColorChangeHandler = (color: ColorResult) => {
    canvasHandler.set('fill', color.hex, isActiveSelection);
    canvasContextDispatcher({ type: 'SET_OBJECT', payload: { selectedObject: canvasHandler.activeObject } });
    if (isActiveSelection) {
      canvasContextDispatcher({ type: 'SET_OBJECTS', payload: { selectedObjects: canvasHandler.activeObjects } });
    }
  };

  const colorPicker = <SketchPicker onChange={onFillColorChangeHandler} color={fill} disableAlpha/>;

  return (
    <ToolWrapper title={'Fill Color'}>
      <Popover title={'Color Picker'} content={colorPicker} placement={'topLeft'} trigger={'click'}>
        <Button shape={'circle-outline'} style={{ backgroundColor: fill }}/>
      </Popover>
    </ToolWrapper>
  );
}, arePropsEqual<IFillToolProps>('fill'));
