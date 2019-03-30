import { fabric } from 'fabric';
import React, { FC, ReactNode, useContext, useMemo } from 'react';
import { CanvasContext } from '@contexts/CanvasContext';
import { Fonts } from '@fonts/Fonts';
import { StyledDivider } from '@utils/ui';
import { FillTool, OpacityTool } from '@components/Editor/Drawers/Tools/Dynamic/Common';
import { CroppingTools, ImageTools } from '@components/Editor/Drawers/Tools/Dynamic/Image';
import { FontTool, TextHighlightTool } from '@components/Editor/Drawers/Tools/Dynamic/Text';
import { CanvasSizeTools } from '@components/Editor/Drawers/Tools/Dynamic/Workarea';
import { BackgroundWithOpacityTool } from '@components/Editor/Drawers/Tools/Dynamic/Workarea/BackgroundWithOpacity';

export const DynamicTools: FC = () => {
  const {
          state: {
            selectedObject,
            isActiveSelection,
            canvasHandler,
            workareaBackgroundColor,
            isWorkareaBackgroundModified,
            isInCroppingMode
          },
          dispatch
        } = useContext(CanvasContext);
  const type = selectedObject ? selectedObject.type : '';
  const opacity = selectedObject ? selectedObject.opacity : 1;
  let tools: ReactNode;

  switch (type) {
    case 'textbox': {
      const { fontFamily, fontWeight, fontStyle, fontSize, underline, linethrough, lineHeight, charSpacing, textAlign } = selectedObject as fabric.Textbox;
      const fontProps = {
        fontFamily,
        fontWeight,
        fontStyle,
        fontSize,
        underline,
        linethrough,
        lineHeight,
        charSpacing,
        textAlign
      };

      tools = (
        <>
          <FontTool fonts={new Fonts()}
                    fontProps={fontProps}
                    canvasHandler={canvasHandler}
                    isActiveSelection={isActiveSelection}
                    canvasContextDispatcher={dispatch}/>
          <StyledDivider/>
          <FillTool fill={selectedObject.fill}
                    canvasContextDispatcher={dispatch}
                    isActiveSelection={isActiveSelection}
                    canvasHandler={canvasHandler}/>
          <StyledDivider/>
          <TextHighlightTool textBackgroundColor={(selectedObject as fabric.Textbox).textBackgroundColor}
                             canvasHandler={canvasHandler}
                             isActiveSelection={isActiveSelection}
                             canvasContextDispatcher={dispatch}/>
          <StyledDivider/>
        </>
      );
      break;
    }

    case 'activeSelection':
    case 'group':
      tools = (
        <>
          <FillTool fill={selectedObject.fill}
                    canvasContextDispatcher={dispatch}
                    isActiveSelection={isActiveSelection}
                    canvasHandler={canvasHandler}/>
          <StyledDivider/>
        </>
      );
      break;
    case 'image':
      tools = (
        <>
          {<ImageTools canvasContextDispatcher={dispatch}
                       isActiveSelection={isActiveSelection}
                       canvasHandler={canvasHandler}
                       shouldSetBackgroundDisabled={!isWorkareaBackgroundModified}/>}
          <StyledDivider/>
        </>
      );
    default:
      break;
  }

  return useMemo(() => {
    return (
      <>
        {!selectedObject && (
          <>
            <CanvasSizeTools/>
            <StyledDivider/>
            <BackgroundWithOpacityTool/>
            <StyledDivider/>
          </>
        )}
        {tools}
        {isInCroppingMode && <CroppingTools/>}
        {selectedObject && !isInCroppingMode && <OpacityTool opacity={opacity}
                                                             canvasContextDispatcher={dispatch}
                                                             isActiveSelection={isActiveSelection}
                                                             canvasHandler={canvasHandler}/>}
      </>
    );
  }, [selectedObject, workareaBackgroundColor, opacity, isWorkareaBackgroundModified, isInCroppingMode]);
};
