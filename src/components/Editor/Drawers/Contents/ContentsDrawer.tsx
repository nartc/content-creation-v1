import { Layout } from 'antd';
import React, { FC, memo } from 'react';
import { arePropsEqual } from '@utils/arePropsEqual';

interface IContentsDrawerProps {
  isOpened: boolean;
}

export const ContentsDrawer: FC<IContentsDrawerProps> = memo(({ isOpened, children }) => (
  <Layout.Sider theme={'light'}
                collapsible
                collapsed={isOpened}
                collapsedWidth={0}
                trigger={null}
                className={'drawer-sider'}>
    {children}
  </Layout.Sider>
), arePropsEqual<IContentsDrawerProps>('isOpened'));
