import React, { FC, memo } from 'react';
import { ReactComponent as Duplicate } from '@customIcons/group-object/duplicate.svg';
import { ReactComponent as Grouping } from '@customIcons/group-object/group.svg';
import { ReactComponent as Ungrouping } from '@customIcons/group-object/ungroup.svg';
import { arePropsEqual } from '@utils/arePropsEqual';
import { IToolWithProps, ToolIcon, ToolWrapper } from '@utils/ui';

interface IGroupObjectToolsProps extends IToolWithProps {
  shouldGroupingDisabled: boolean;
  shouldUngroupingDisabled: boolean;
  shouldDisabled: boolean;
  isObjectLocked: boolean;
}

export const GroupObjectTools: FC<IGroupObjectToolsProps> = memo(props => {
    const { shouldGroupingDisabled, shouldUngroupingDisabled, isObjectLocked, shouldDisabled, canvasContextDispatcher, canvasHandler } = props;

    const onGroupHandler = () => {
      canvasHandler.groupObjects();
      canvasContextDispatcher({ type: 'SET_OBJECT', payload: { selectedObject: canvasHandler.activeObject } });
      canvasContextDispatcher({ type: 'SET_OBJECTS', payload: { selectedObjects: [] } });
      canvasContextDispatcher({ type: 'SET_IS_ACTIVE_SELECTION', payload: { isActiveSelection: false } });
    };

    const onUngroupHandler = () => {
      canvasHandler.ungroupObjects();
      canvasHandler.lockActiveSelectionMovement();
      canvasContextDispatcher({ type: 'SET_OBJECT', payload: { selectedObject: canvasHandler.activeObject } });
      canvasContextDispatcher({ type: 'SET_OBJECTS', payload: { selectedObjects: canvasHandler.activeObjects } });
      canvasContextDispatcher({ type: 'SET_IS_ACTIVE_SELECTION', payload: { isActiveSelection: true } });
    };

    const onToggleLockHandler = () => {
      canvasHandler.toggleLockObject(!canvasHandler.isActiveObjectLocked);
      canvasContextDispatcher({ type: 'SET_OBJECT', payload: { selectedObject: canvasHandler.activeObject } });
    };

    const onDuplicateHandler = () => {
      canvasHandler.duplicateObject();
      const isActiveSelection = canvasHandler.activeObject.isType('activeSelection');
      if (isActiveSelection) {
        canvasHandler.lockActiveSelectionMovement();
        canvasContextDispatcher({ type: 'SET_OBJECT', payload: { selectedObject: canvasHandler.activeObject } });
        canvasContextDispatcher({ type: 'SET_OBJECTS', payload: { selectedObjects: canvasHandler.activeObjects } });
        canvasContextDispatcher({ type: 'SET_IS_ACTIVE_SELECTION', payload: { isActiveSelection: true } });
      } else {
        canvasContextDispatcher({ type: 'SET_OBJECT', payload: { selectedObject: canvasHandler.activeObject } });
        canvasContextDispatcher({ type: 'SET_OBJECTS', payload: { selectedObjects: [] } });
        canvasContextDispatcher({ type: 'SET_IS_ACTIVE_SELECTION', payload: { isActiveSelection: false } });
      }
    };

    const onDeleteHandler = () => {
      canvasHandler.deleteObject();
      canvasContextDispatcher({ type: 'SET_OBJECT', payload: { selectedObject: canvasHandler.activeObject } });
      canvasContextDispatcher({ type: 'SET_OBJECTS', payload: { selectedObjects: [] } });
      canvasContextDispatcher({ type: 'SET_IS_ACTIVE_SELECTION', payload: { isActiveSelection: false } });
    };

    return (
      <ToolWrapper title={'Group/Object'}>
        <ToolIcon shouldDisabled={shouldGroupingDisabled || isObjectLocked}
                  svgIcon={Grouping}
                  tooltip={'Group'}
                  onClick={onGroupHandler}/>
        <ToolIcon shouldDisabled={shouldUngroupingDisabled || isObjectLocked}
                  svgIcon={Ungrouping}
                  tooltip={'Ungroup'}
                  onClick={onUngroupHandler}/>
        <ToolIcon shouldDisabled={shouldDisabled}
                  type={isObjectLocked ? 'unlock' : 'lock'}
                  tooltip={isObjectLocked ? 'Unlock' : 'Lock'}
                  onClick={onToggleLockHandler}/>
        <ToolIcon shouldDisabled={shouldDisabled || isObjectLocked}
                  svgIcon={Duplicate}
                  tooltip={'Duplicate'}
                  onClick={onDuplicateHandler}/>
        <ToolIcon shouldDisabled={shouldDisabled || isObjectLocked}
                  type={'delete'}
                  tooltip={'Delete'}
                  placement={'leftBottom'}
                  onClick={onDeleteHandler}/>
      </ToolWrapper>
    );
  },
  arePropsEqual<IGroupObjectToolsProps>('shouldDisabled',
    'isObjectLocked',
    'shouldGroupingDisabled',
    'shouldUngroupingDisabled')
);
