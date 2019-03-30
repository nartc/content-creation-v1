import { Button, Popover } from 'antd';
import { fabric } from 'fabric';
import React, { FC, memo } from 'react';
import { ColorResult, SketchPicker } from 'react-color';
import { arePropsEqual } from '@utils/arePropsEqual';
import { IToolWithProps, ToolWrapper } from '@utils/ui';

interface ITextHighlightToolProps extends IToolWithProps {
  textBackgroundColor: string;
}

export const TextHighlightTool: FC<ITextHighlightToolProps> = memo(({ textBackgroundColor, canvasHandler, canvasContextDispatcher }) => {
  const onTextBackgroundColorChangeHandler = (color: ColorResult) => {
    const { a, r, g, b } = color.rgb;
    canvasHandler.set<fabric.Textbox>('textBackgroundColor', `rgba(${r}, ${g}, ${b}, ${a})`);
    canvasContextDispatcher({ type: 'SET_OBJECT', payload: { selectedObject: canvasHandler.activeObject } });
  };

  const colorPicker = <SketchPicker onChange={onTextBackgroundColorChangeHandler} color={textBackgroundColor}/>;

  return (
    <ToolWrapper title={'Text Highlight'}>
      <Popover title={'Color Picker'} content={colorPicker} trigger={'click'}>
        <Button shape={'circle-outline'}
                style={{ backgroundColor: textBackgroundColor }}/>
      </Popover>
    </ToolWrapper>
  );
}, arePropsEqual<ITextHighlightToolProps>('textBackgroundColor'));
