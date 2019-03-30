import React, { FC, useContext, useMemo } from 'react';
import { CanvasContext } from '@contexts/CanvasContext';
import { FlexBox, FlexItem, StyledDivider } from '@utils/ui';
import { AlignmentTools, FlipTools, GroupObjectTools, LayerTools } from '@components/Editor/Drawers/Tools/Static';

export const StaticTools: FC = () => {
  const { state: { selectedObject, isActiveSelection, canvasHandler, isInCroppingMode }, dispatch } = useContext(CanvasContext);

  return useMemo(() => (
      <>
        <AlignmentTools shouldDisabled={!selectedObject || isInCroppingMode}
                        canvasHandler={canvasHandler}
                        canvasContextDispatcher={dispatch}
                        isActiveSelection={isActiveSelection}/>
        <StyledDivider/>
        <FlexBox>
          <FlexItem flex={2} style={{ padding: '0 10px 0 0' }}>
            <LayerTools shouldDisabled={!selectedObject || isInCroppingMode}
                        isActiveSelection={isActiveSelection}
                        canvasContextDispatcher={dispatch}
                        canvasHandler={canvasHandler}/>
          </FlexItem>
          <FlexItem flex={1} style={{ padding: '0 0 0 10px' }}>
            <FlipTools shouldDisabled={!selectedObject || isInCroppingMode}
                       canvasHandler={canvasHandler}
                       canvasContextDispatcher={dispatch}
                       isActiveSelection={isActiveSelection}/>
          </FlexItem>
        </FlexBox>
        <StyledDivider/>
        <GroupObjectTools shouldDisabled={!selectedObject || isInCroppingMode}
                          shouldGroupingDisabled={!selectedObject || !isActiveSelection || isInCroppingMode}
                          shouldUngroupingDisabled={!selectedObject || !selectedObject.isType('group') || isInCroppingMode}
                          canvasContextDispatcher={dispatch}
                          canvasHandler={canvasHandler}
                          isActiveSelection={isActiveSelection}
                          isObjectLocked={canvasHandler ? canvasHandler.isActiveObjectLocked : false}/>
        <StyledDivider/>
      </>
    ), [selectedObject, isActiveSelection, canvasHandler.isActiveObjectLocked, isInCroppingMode]
  );
};
