import { Layout } from 'antd';
import React, { FC, useContext, useMemo } from 'react';
import { CanvasContext } from '@contexts/CanvasContext';
import { DynamicTools } from '@components/Editor/Drawers/Tools/DynamicTools';
import { StaticTools } from '@components/Editor/Drawers/Tools/StaticTools';

export const ToolsDrawer: FC = () => {
  const { state: { selectedObject } } = useContext(CanvasContext);
  return useMemo(() => (
    <Layout.Sider theme={'light'}
                  width={250}
                  className={'tools-sider'}>
      <StaticTools/>
      <DynamicTools/>
    </Layout.Sider>
  ), [selectedObject]);
};

