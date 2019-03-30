import { Input, Typography } from 'antd';
import React, { FC, useContext, useMemo, useRef } from 'react';
import { CanvasContext, EditorContext } from '@contexts/index';
import { ToolWrapper, displayInfo, FlexBox, FlexItem, TooltipWrapper  } from '@utils/ui';

export const CanvasSizeTools: FC = () => {
  const { state: { workareaWidth, workareaHeight }, dispatch: editorCtxDispatcher } = useContext(EditorContext);
  const { state: { canvasHandler }, dispatch: canvasCtxDispatcher } = useContext(CanvasContext);
  const isBlurFromEnter = useRef(false);
  const isBlurAction = useRef(false);

  const setDimensionValue = (key: 'width' | 'height') => {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
      const dimension = { width: workareaWidth, height: workareaHeight };
      const newValue = parseInt(event.target.value);
      if (isNaN(newValue)) {
        return;
      }
      dimension[key] = newValue;
      editorCtxDispatcher({
        type: 'SET_WORKAREA_DIMENSION',
        payload: { workareaHeight: dimension.height, workareaWidth: dimension.width }
      });
    };
  };

  const onEnterPressed = event => {
    isBlurFromEnter.current = false;
    isBlurAction.current = false;
    onSizeChanged(event);
  };

  const onInputBlur = event => {
    isBlurAction.current = true;
    onSizeChanged(event);
  };

  const onSizeChanged = ({ target }) => {
    if (isBlurFromEnter.current) {
      isBlurFromEnter.current = false;
      isBlurAction.current = false;
      return;
    }

    const scaleRatio = canvasHandler.calculateScaleRatio(workareaWidth, workareaHeight);
    canvasCtxDispatcher({ type: 'SET_SCALE_FACTOR', payload: { scaleFactor: scaleRatio } });
    canvasHandler.resetWorkareaDimension(workareaWidth, workareaHeight, scaleRatio);
    displayInfo(`Resize to ${workareaWidth}px x ${workareaHeight}px`);

    if (!isBlurFromEnter.current && !isBlurAction.current) {
      isBlurFromEnter.current = true;
      isBlurAction.current = true;
      target.blur();
    }
  };

  return useMemo(() => {
    return (
      <ToolWrapper title={'Canvas Size'}>
        <FlexBox flexDirection={'column'}
                 alignItems={'center'}
                 justifyContent={'center'}
                 style={{ padding: '0 10px 0 0' }}>
          <TooltipWrapper render={() => <Input addonAfter={'px'} value={workareaWidth}
                                               onChange={setDimensionValue('width')}
                                               onPressEnter={onEnterPressed}
                                               onBlur={onInputBlur}/>} title={'Set Width'}/>
          <FlexItem alignSelf={'center'}>
            <Typography.Text>Width</Typography.Text>
          </FlexItem>
        </FlexBox>
        <FlexBox flexDirection={'column'}
                 alignItems={'center'}
                 justifyContent={'center'}
                 style={{ padding: '0 0 0 10px' }}>
          <TooltipWrapper render={() => <Input addonAfter={'px'} value={workareaHeight}
                                               onChange={setDimensionValue('height')}
                                               onPressEnter={onEnterPressed}
                                               onBlur={onInputBlur}/>} title={'Set Height'}/>
          <FlexItem alignSelf={'center'}>
            <Typography.Text>Height</Typography.Text>
          </FlexItem>
        </FlexBox>
      </ToolWrapper>
    );
  }, [workareaHeight, workareaWidth]);
};
