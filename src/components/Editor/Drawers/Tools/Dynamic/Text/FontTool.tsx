import { Select, Slider, Typography } from 'antd';
import { SliderValue } from 'antd/lib/slider';
import { fabric } from 'fabric';
import React, { FC, memo } from 'react';
import styled from 'styled-components';
import { Font, Fonts } from '@fonts/Fonts';
import { arePropsEqual } from '@utils/arePropsEqual';
import { FlexBox, FlexItem, IToolWithProps, ToolIcon, ToolWrapper } from '@utils/ui';

interface ITextFontProps {
  fontFamily: string;
  fontSize: number;
  fontStyle: string;
  fontWeight: string | number;
  textAlign: string;
  underline: boolean;
  linethrough: boolean;
  charSpacing: number;
  lineHeight: number;
}

interface IFontToolProps extends IToolWithProps {
  fonts: Fonts;
  fontProps: ITextFontProps;
}

const FontControlFlexbox = styled(FlexBox)`
  width: 100%;
  margin-top: 1em;
`;

export const FontTool: FC<IFontToolProps> = memo(({ fonts, fontProps, canvasHandler, canvasContextDispatcher }) => {
  const { fontFamily, fontSize, fontStyle, fontWeight, textAlign, underline, linethrough, charSpacing, lineHeight } = fontProps;

  const fontFaces = fonts.fontFaces;
  const customFontFaces = fonts.customFontFaces;
  const fontSizes = fonts.fontSizes;

  const onFontChangedHandler = (value: string) => {
    canvasHandler.set<fabric.Textbox>('fontFamily', value);
    canvasContextDispatcher({ type: 'SET_OBJECT', payload: { selectedObject: canvasHandler.activeObject } });
  };

  const onFontSizeChangedHandler = (value: number) => {
    canvasHandler.set<fabric.Textbox>('fontSize', value);
    canvasContextDispatcher({ type: 'SET_OBJECT', payload: { selectedObject: canvasHandler.activeObject } });
  };

  const onBoldHandler = () => {
    canvasHandler.set<fabric.Textbox>('fontWeight', fontWeight === 'bold' ? 'normal' : 'bold');
    canvasContextDispatcher({ type: 'SET_OBJECT', payload: { selectedObject: canvasHandler.activeObject } });
  };

  const onItalicHandler = () => {
    canvasHandler.set<fabric.Textbox>('fontStyle', fontStyle === 'italic' ? 'normal' : 'italic');
    canvasContextDispatcher({ type: 'SET_OBJECT', payload: { selectedObject: canvasHandler.activeObject } });
  };

  const onUnderlineHandler = () => {
    canvasHandler.set<fabric.Textbox>('underline', !underline);
    canvasContextDispatcher({ type: 'SET_OBJECT', payload: { selectedObject: canvasHandler.activeObject } });
  };

  const onStrikethroughHandler = () => {
    canvasHandler.set<fabric.Textbox>('linethrough', !linethrough);
    canvasContextDispatcher({ type: 'SET_OBJECT', payload: { selectedObject: canvasHandler.activeObject } });
  };

  const onAlignHandler = (value: string) => () => {
    canvasHandler.set<fabric.Textbox>('textAlign', value);
    canvasContextDispatcher({ type: 'SET_OBJECT', payload: { selectedObject: canvasHandler.activeObject } });
  };

  const onLineHeightChangeHandler = (value: SliderValue) => {
    canvasHandler.set<fabric.Textbox>('lineHeight', value);
    canvasContextDispatcher({ type: 'SET_OBJECT', payload: { selectedObject: canvasHandler.activeObject } });
  };

  const onCharSpacingChangeHandler = (value: SliderValue) => {
    canvasHandler.set<fabric.Textbox>('charSpacing', value);
    canvasContextDispatcher({ type: 'SET_OBJECT', payload: { selectedObject: canvasHandler.activeObject } });
  };

  const renderFont = (font: Font) => {
    const fontOptionProps = {
      value: font.name,
      style: font.style
    };
    return <Select.Option key={font.name} {...fontOptionProps}>{font.name}</Select.Option>;
  };

  return (
    <ToolWrapper title={'Font'} isWrapped>
      <Select value={fontFamily}
              onChange={onFontChangedHandler}
              style={{ width: 150 }}
              size={'small'}>
        <Select.OptGroup label={'Custom'}>
          {customFontFaces.map(renderFont)}
        </Select.OptGroup>
        <Select.OptGroup label={'Web-safe'}>
          {fontFaces.map(renderFont)}
        </Select.OptGroup>
      </Select>
      <Select value={fontSize}
              size={'small'}
              onChange={onFontSizeChangedHandler}
              style={{ width: 65 }}
      >
        {fontSizes.map(size => <Select.Option key={size} value={size}>{size}</Select.Option>)}
      </Select>
      <FontControlFlexbox alignItems={'center'} justifyContent={'space-between'}>
        <ToolIcon type={'bold'} onClick={onBoldHandler} isActive={fontWeight === 'bold'} tooltip={'Bold'}/>
        <ToolIcon type={'italic'} onClick={onItalicHandler} isActive={fontStyle === 'italic'} tooltip={'Italic'}/>
        <ToolIcon type={'underline'} onClick={onUnderlineHandler} isActive={underline} tooltip={'Underline'}/>
        <ToolIcon type={'strikethrough'}
                  onClick={onStrikethroughHandler}
                  isActive={linethrough}
                  tooltip={'Strikethrough'}/>
        <ToolIcon type={'align-left'}
                  onClick={onAlignHandler('left')}
                  isActive={textAlign === 'left'}
                  tooltip={'Align Left'}/>
        <ToolIcon type={'align-center'}
                  onClick={onAlignHandler('center')}
                  isActive={textAlign === 'center'}
                  tooltip={'Align Center'}/>
        <ToolIcon type={'align-right'}
                  onClick={onAlignHandler('right')}
                  isActive={textAlign === 'right'}
                  tooltip={'Align Right'}
                  placement={'leftBottom'}/>
      </FontControlFlexbox>
      <FontControlFlexbox alignItems={'center'} justifyContent={'space-between'}>
        <FontControlFlexbox flexDirection={'column'}
                            justifyContent={'center'}
                            style={{ padding: '0 10px 0 0' }}>
          <FlexItem>
            <Typography.Text>Line Height</Typography.Text>
          </FlexItem>
          <Slider style={{ width: '100%' }}
                  value={lineHeight}
                  max={2.5}
                  min={0.5}
                  step={0.1}
                  onChange={onLineHeightChangeHandler}/>
        </FontControlFlexbox>
        <FontControlFlexbox flexDirection={'column'}
                            justifyContent={'center'}
                            style={{ padding: '0 10px 0 0' }}>
          <FlexItem>
            <Typography.Text>Char Spacing</Typography.Text>
          </FlexItem>
          <Slider style={{ width: '100%' }}
                  value={charSpacing}
                  max={600}
                  min={-150}
                  step={5}
                  onChange={onCharSpacingChangeHandler}/>
        </FontControlFlexbox>
      </FontControlFlexbox>
    </ToolWrapper>
  );
}, arePropsEqual<IFontToolProps>('fontProps'));
