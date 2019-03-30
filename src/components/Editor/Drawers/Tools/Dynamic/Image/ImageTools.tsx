import React, { FC, memo } from 'react';
import { ReactComponent as Crop } from '@customIcons/image/crop.svg';
import { ReactComponent as SetBackground } from '@customIcons/image/set-background.svg';
import { arePropsEqual } from '@utils/arePropsEqual';
import { FlexBox, IToolWithProps, ToolIcon, ToolWrapper  } from '@utils/ui';

interface IImageToolsProps extends IToolWithProps {
  shouldSetBackgroundDisabled: boolean;
}

export const ImageTools: FC<IImageToolsProps> = memo(({ canvasHandler, canvasContextDispatcher, shouldSetBackgroundDisabled }) => {
  const onCropClickHandler = () => {
    canvasHandler.initializeWorkareaBackgroundCropping();
    canvasContextDispatcher({
      type: 'SET_IS_IN_CROPPING_MODE',
      payload: { isInCroppingMode: canvasHandler.isInCroppingMode }
    });
  };

  const onSetAsBackgroundClickHandler = () => {
    canvasHandler.resetWorkareaImageAsBackground();
    canvasContextDispatcher({
      type: 'SET_IS_WORKAREA_BACKGROUND_MODIFIED',
      payload: { isWorkareaBackgroundModified: false }
    });
  };

  return (
    <ToolWrapper title={'Image Tools'}>
      <FlexBox alignItems={'center'}>
        <ToolIcon tooltip={'Crop'} svgIcon={Crop} onClick={onCropClickHandler}/>
        <ToolIcon tooltip={'Set as Background'}
                  svgIcon={SetBackground}
                  style={{ marginLeft: '1em' }}
                  shouldDisabled={shouldSetBackgroundDisabled} onClick={onSetAsBackgroundClickHandler}/>
      </FlexBox>
    </ToolWrapper>
  );
}, arePropsEqual<IImageToolsProps>('shouldSetBackgroundDisabled'));
