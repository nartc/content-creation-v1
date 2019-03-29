import { Icon, Layout } from 'antd';
import React, { FC, useContext } from 'react';
import styled from 'styled-components';
import { CanvasContext } from '../../contexts';
import { FlexBox } from '../../utils/ui';

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
`;

const FooterText = styled.span`
  font-size: 12px;
  margin-right: 10px;
`;

export const EditorFooter: FC = () => {
  const { state: { scaleFactor } } = useContext(CanvasContext);

  return (
    <Footer>
      <FlexBox alignItems={'center'}
               justifyContent={'space-between'}
               style={{ padding: '5px 10px', width: 110, background: 'white', borderRadius: 10 }}>
        <FooterIcon type={'zoom-out'}/>
        <FooterText>{`${Math.round(scaleFactor * 100)}`}%</FooterText>
        <FooterIcon type={'zoom-in'}/>
      </FlexBox>
    </Footer>
  );
};
