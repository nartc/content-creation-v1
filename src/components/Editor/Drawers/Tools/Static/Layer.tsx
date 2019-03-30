import React, { FC, memo } from 'react';
import { ReactComponent as BringForward } from '../../../../../icons/layer/bring-forward.svg';
import { ReactComponent as BringToFront } from '../../../../../icons/layer/bring-to-front.svg';
import { ReactComponent as SendBackward } from '../../../../../icons/layer/send-backward.svg';
import { ReactComponent as SendToBack } from '../../../../../icons/layer/send-to-back.svg';
import { arePropsEqual } from '@utils/arePropsEqual';
import { LayerType } from '@utils/fabric';
import { IToolWithProps, ToolIcon, ToolWrapper } from '@utils/ui';

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
