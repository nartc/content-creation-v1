import { Icon, Layout, Menu } from 'antd';
import React, { FC } from 'react';

interface IEditorSideMenuProps {
  openMenu: (isOpened: boolean) => void;
  isOpened: boolean;
}

export const EditorSideMenu: FC<IEditorSideMenuProps> = ({ openMenu, isOpened }) => (
  <Layout.Sider collapsible
                collapsed={true}
                theme={'light'}
                trigger={null}
                className={'icon-sider'}>
    <Menu theme={'light'} mode={'inline'}>
      <Menu.Item key={'1'} onClick={() => {
        openMenu(!isOpened);
      }}>
        <Icon type={'setting'}/>
        <span>Testing</span>
      </Menu.Item>
      <Menu.Item key={'2'}>
        <Icon type={'pie-chart'}/>
        <span>Pie Chart</span>
      </Menu.Item>
      <Menu.Item key={'3'}>
        <Icon type={'desktop'}/>
        <span>Desktop</span>
      </Menu.Item>
    </Menu>
  </Layout.Sider>
);
