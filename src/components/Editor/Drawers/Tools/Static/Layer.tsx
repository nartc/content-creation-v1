import { ReactComponent as BringForward } from '@customIcons/layer/bring-forward.svg';
import { ReactComponent as BringToFront } from '@customIcons/layer/bring-to-front.svg';
import { ReactComponent as SendBackward } from '@customIcons/layer/send-backward.svg';
import { ReactComponent as SendToBack } from '@customIcons/layer/send-to-back.svg';
import { arePropsEqual } from '@utils/arePropsEqual';
import { LayerType } from '@utils/fabric';
import { IToolWithProps, ToolIcon, ToolWrapper } from '@utils/ui';
import React, { FC, memo } from 'react';

interface ILayerToolsProps extends IToolWithProps {
  shouldDisabled: boolean;
}

export const LayerTools: FC<ILayerToolsProps> = memo(({ shouldDisabled, canvasContextDispatcher, canvasHandler }) => {
  const onLayerHandler = (type: LayerType) => () => {
    canvasHandler.orderObject(type);
    canvasContextDispatcher({ type: 'SET_OBJECT', payload: { selectedObject: canvasHandler.activeObject } });
  };

  return (
    <ToolWrapper title={'Layer'}>
      <ToolIcon shouldDisabled={shouldDisabled}
                svgIcon={BringForward}
                tooltip={'Bring Forward'}
                onClick={onLayerHandler('forward')}/>
      <ToolIcon shouldDisabled={shouldDisabled}
                svgIcon={BringToFront}
                tooltip={'Bring to Front'}
                onClick={onLayerHandler('front')}/>
      <ToolIcon shouldDisabled={shouldDisabled}
                svgIcon={SendBackward}
                tooltip={'Send Backward'}
                onClick={onLayerHandler('backward')}/>
      <ToolIcon shouldDisabled={shouldDisabled}
                svgIcon={SendToBack}
                tooltip={'Send to Back'}
                onClick={onLayerHandler('back')}/>
    </ToolWrapper>
  );
}, arePropsEqual<ILayerToolsProps>('shouldDisabled'));
