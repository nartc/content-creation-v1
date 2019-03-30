import { Button, Popover, Select, Typography, Upload } from 'antd';
import { SliderValue } from 'antd/lib/slider';
import { UploadChangeParam } from 'antd/lib/upload';
import React, { FC, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { ChromePicker, ColorResult } from 'react-color';
import styled from 'styled-components';
import {CanvasContext, EditorContext} from '@contexts/index';
import { FabricObjectBuilder } from '@utils/fabric';
import { ToolWrapper, FlexBox, displayInfo, FullWidthSlider  } from '@utils/ui';

const StyledSelect = styled(Select)<{ marginLeft: string | number }>`
  margin-left: ${props => `${props.marginLeft} !important`};
`;

const useFileReaderEffect = (onLoadCallback: (event: ProgressEvent) => void) => {
  const fileReader = useRef(new FileReader());

  useEffect(() => {
    fileReader.current.addEventListener('load', onLoadCallback);
    return () => {
      fileReader.current.removeEventListener('load', onLoadCallback);
    };
  }, []);

  return fileReader.current;
};

export const BackgroundWithOpacityTool: FC = () => {
  const [backgroundType, setBackgroundType] = useState('solid');
  const { state: { canvasHandler, workareaBackgroundColor, workareaOpacity }, dispatch: canvasCtxDispatcher } = useContext(CanvasContext);
  const {dispatch: editorCtxDispatcher} = useContext(EditorContext);

  const onLoadBackgroundImageHandler = (event: ProgressEvent) => {
    FabricObjectBuilder().image(event.target['result'], {}, image => {
      const { width, height } = image;
      const scaleRatio = canvasHandler.calculateScaleRatio(width, height);
      canvasCtxDispatcher({ type: 'SET_SCALE_FACTOR', payload: { scaleFactor: scaleRatio } });
      editorCtxDispatcher({type: 'SET_WORKAREA_DIMENSION', payload: {workareaWidth: width, workareaHeight: height}});
      canvasHandler.addBackgroundImage(image, scaleRatio);
      displayInfo(`Resize to ${width}px x ${height}px`);
    });
  };

  const fileReader = useFileReaderEffect(onLoadBackgroundImageHandler);

  const onColorChangedHandler = (color: ColorResult) => {
    canvasHandler.resetWorkareaBackground(color.hex);
    canvasCtxDispatcher({ type: 'SET_WORKAREA_BACKGROUND', payload: { workareaBackgroundColor: color.hex } });
  };

  const onOpacityChangedHandler = (value: SliderValue) => {
    canvasHandler.resetWorkareaOpacity(value as number);
    canvasCtxDispatcher({ type: 'SET_WORKAREA_OPACITY', payload: { workareaOpacity: value as number } });
  };

  const onBackgroundTypeChangedHandler = (value: string) => {
    setBackgroundType(value);
  };

  const backgroundColorPicker = <ChromePicker color={workareaBackgroundColor}
                                              onChange={onColorChangedHandler}
                                              disableAlpha/>;

  const onFileUploadChangedHandler = (info: UploadChangeParam) => {
    console.log('file upload -->', info);
  };

  const onUploadCustomRequestHandler = (option: any) => {
    const file = option.file as File;
    fileReader.readAsDataURL(file);
  };

  const renderControls = () => {
    return backgroundType === 'solid'
           ? (
             <FlexBox alignItems={'center'} justifyContent={'space-between'} style={{ width: '100%' }}>
               <Popover trigger={'click'} content={backgroundColorPicker} placement={'bottom'}>
                 <Button htmlType={'button'}
                         shape={'circle-outline'}
                         style={{
                           backgroundColor: workareaBackgroundColor,
                           minWidth: 32,
                           maxWidth: 32,
                           opacity: workareaOpacity
                         }}/>
               </Popover>
               <FullWidthSlider value={workareaOpacity}
                                max={1}
                                min={0}
                                step={0.01}
                                onChange={onOpacityChangedHandler}
                                tipFormatter={null}/>
               <Typography.Text>{`${(workareaOpacity * 100).toFixed(0)}%`}</Typography.Text>
             </FlexBox>
           ) : (
             <FlexBox alignItems={'center'} justifyContent={'space-between'} style={{ width: '100%' }}>
               <Upload onChange={onFileUploadChangedHandler}
                       customRequest={onUploadCustomRequestHandler}
                       accept={'.jpg,.jpeg,.png,.gif'}
                       name={'background'}
                       type={'select'}
                       showUploadList={false}
                       action={null}>
                 <Button htmlType={'button'}
                         shape={'circle-outline'}
                         style={{
                           minWidth: 32,
                           maxWidth: 32,
                           opacity: workareaOpacity
                         }}
                         icon={'upload'}/>
               </Upload>
               <FullWidthSlider value={workareaOpacity}
                                max={1}
                                min={0}
                                step={0.01}
                                onChange={onOpacityChangedHandler}
                                tipFormatter={null}/>
               <Typography.Text>{`${(workareaOpacity * 100).toFixed(0)}%`}</Typography.Text>
             </FlexBox>
           );
  };

  return useMemo(() => {
    return (
      <ToolWrapper title={'Background'} isWrapped>
        <FlexBox alignItems={'center'} style={{ width: '100%' }}>
          <Typography.Text>Type: </Typography.Text>
          <StyledSelect value={backgroundType} marginLeft={'1em'} onChange={onBackgroundTypeChangedHandler}>
            <Select.Option value={'solid'}>Solid</Select.Option>
            <Select.Option value={'image'}>Image</Select.Option>
          </StyledSelect>
        </FlexBox>
        {renderControls()}
      </ToolWrapper>
    );
  }, [workareaBackgroundColor, workareaOpacity, backgroundType]);
};
