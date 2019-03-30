import { CanvasContext } from '@contexts/CanvasContext';
import { FlexBox } from '@utils/ui';
import { Icon, Layout } from 'antd';
import React, { FC, useContext, useMemo } from 'react';
import styled from 'styled-components';

const Footer = styled(Layout.Footer)`
  position: absolute;
  bottom: 0;
  height: 50px;
  background: rgba(255, 255, 255, 0);
  display: flex;
  align-items: center;
`;

const FooterIcon = styled(Icon)`
  font-size: 18px;
  margin-right: 10px;
  cursor: pointer;
`;

const FooterText = styled.span`
  font-size: 12px;
  margin-right: 10px;
`;

export const EditorFooter: FC = () => {
  const { state: { scaleFactor, canvasHandler }, dispatch: canvasCtxDispatcher } = useContext(CanvasContext);

  const onZoomClick = (delta: number) => () => {
    canvasHandler.zoom(delta, canvasHandler.canvas.getVpCenter());
    canvasCtxDispatcher({ type: 'SET_SCALE_FACTOR', payload: { scaleFactor: canvasHandler.zoomLevel } });
  };

  return useMemo(() => (
    <Footer>
      <FlexBox alignItems={'center'}
               justifyContent={'space-between'}
               style={{ padding: '5px 10px', width: 110, background: 'white', borderRadius: 10 }}>
        <FooterIcon type={'zoom-out'} onClick={onZoomClick(-5)}/>
        <FooterText>{`${Math.round(scaleFactor * 100)}`}%</FooterText>
        <FooterIcon type={'zoom-in'} onClick={onZoomClick(5)}/>
      </FlexBox>
    </Footer>
  ), [scaleFactor]);
};
