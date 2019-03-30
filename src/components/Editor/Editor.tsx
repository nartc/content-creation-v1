import { Layout } from 'antd';
import React, { FC, useContext, useState } from 'react';
import styled from 'styled-components';
import { EditorContext } from '@contexts/EditorContext';
import { ContentsDrawer } from '@components/Editor/Drawers/Contents/ContentsDrawer';
import { ToolsDrawer } from '@components/Editor/Drawers/Tools/ToolsDrawer';
import { EditorFooter } from '@components/Editor/EditorFooter';
import { EditorSideMenu } from '@components/Editor/EditorSideMenu';
import { EditorWorkarea } from '@components/Editor/Workarea/EditorWorkarea';

const StyledLayout = styled(Layout)`
  min-height: 100vh;
  
  .icon-sider {
    box-shadow: 0 1px 1px 1px rgba(25, 25, 25, 0.1);
    
    .ant-layout-sider-children {
      ul.ant-menu.ant-menu-light.ant-menu-inline-collapsed.ant-menu-root {
        border: none;
        
        li.ant-menu-item {
          margin: 0;
          &.ant-menu-item-selected {
            background-color: #f5f5f5;
          } 
        }
      }
    }
  }
  
  .drawer-sider {
    box-shadow: 0 1px 1px 1px rgba(25, 25, 25, 0.1);
    background: #f5f5f5;
    overflow: auto;
    height: 100vh;
  }
  
  .tools-sider {
    box-shadow: 0 0 1px 1px rgba(25, 25, 25, 0.1);
    padding: 10px;
    overflow-y: auto;
    max-height: 100vh;
  }
`;

export const Editor: FC = () => {
  /**
   * States
   */
  const [isDrawerVisible, setIsDrawerVisible] = useState(true);

  /**
   * Contexts
   */
  const editorCtx = useContext(EditorContext);

  const dragStartHandler = (type: string) => () => {
    editorCtx.dispatch({ type: 'SET_DRAGGING_ITEM', payload: { draggingItem: type } });
  };

  const dragEndHandler = () => {
    editorCtx.dispatch({ type: 'SET_DRAGGING_ITEM', payload: { draggingItem: '' } });
  };

  const drawerContent = (
    <>
      <span draggable
            onDragStart={dragStartHandler('triangle')}
            onDragEnd={dragEndHandler}>
              Drag me for a triangle
      </span>
      <br/>
      <span draggable
            onDragStart={dragStartHandler('textbox')}
            onDragEnd={dragEndHandler}>
              Drag me for text
      </span>
    </>
  );

  return (
    <StyledLayout>
      <EditorSideMenu isOpened={isDrawerVisible} openMenu={setIsDrawerVisible}/>
      <Layout>
        <ContentsDrawer isOpened={isDrawerVisible}>
          {drawerContent}
        </ContentsDrawer>
        <Layout>
          <EditorWorkarea/>
          <EditorFooter/>
        </Layout>
        <ToolsDrawer/>
      </Layout>
    </StyledLayout>
  );
};
