import { CanvasContext, EditorContext, IEditorContextReducerActions, IEditorContextState } from '@contexts/index';
import { FabricObjectBuilder } from '@utils/fabric';
import { Layout } from 'antd';
import { fabric } from 'fabric';
import React, { Dispatch, FC, MutableRefObject, ReducerAction, useContext, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { defaultCanvasOptions, defaultWorkareaOptions } from '../../../constants';

const StyledLayoutContent = styled(Layout.Content)`
  background-color: #f0f2f4;
  min-height: 280px;
`;

const EditorWrapper = styled.div`
  display: flex;
  position: relative;
  flex: 1;
  height: 100%;
`;

const EditorContainer = styled.div`
  position: absolute;
  height: 100%;
  width: 100%;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const EditorWorkarea: FC = () => {
  /**
   * Refs
   */
  const canvasRef = useRef<HTMLCanvasElement>();
  const containerRef = useRef<HTMLDivElement>();
  /**
   * Canvas Dimension Effect
   */
  const { state: editorCtxState, dispatch: editorCtxDispatcher } = useCanvasDimension(containerRef);

  /**
   * Canvas Effect
   */
  const { state: canvasCtxState, dispatch: canvasCtxDispatcher } = useFabricCanvas(editorCtxState, editorCtxDispatcher, canvasRef);

  /**
   * Fabric Listener
   */
  useEffect(() => {
    if (editorCtxState.fabricCanvas) {
      setupFabricListeners();
    }

    return () => {
      if (editorCtxState.fabricCanvas) {
        editorCtxState.fabricCanvas.off({
          'selection:created': handleSelection,
          'selection:cleared': handleSelection,
          'selection:updated': handleSelection,
        });
      }
    };
  }, [canvasCtxState]);

  /**
   * Canvas Handlers
   */
  const setupFabricListeners = () => {
    editorCtxState.fabricCanvas.on({
      'selection:created': handleSelection,
      'selection:cleared': handleSelection,
      'selection:updated': handleSelection,
      'object:modified': handleObjectModified,
      'object:moving': handleObjectMoving,
      'object:scaling': handleObjectScaling,
      'mouse:wheel': handleMouseWheel,
      'mouse:down': event => {
        event.e.preventDefault();
        event.e.stopPropagation();

        if (event.e['altKey']) {
          canvasCtxState.canvasHandler.isDragging = true;
          canvasCtxState.canvasHandler.lastPositionX = event.e['clientX'];
          canvasCtxState.canvasHandler.lastPositionY = event.e['clientY'];
          canvasCtxState.canvasHandler.setSelection(false);
        }
      },
      'mouse:up': _ => {
        canvasCtxState.canvasHandler.isDragging = false;
        canvasCtxState.canvasHandler.setSelection(true);
      },
      'mouse:move': handleMouseMove,
    });
  };

  const handleSelection = (event: fabric.IEvent) => {
    if (event['deselected'] && !event['selected']) {
      if (canvasCtxState.isInCroppingMode) {
        canvasCtxState.canvasHandler.removeCroppingRect();
      }
      canvasCtxDispatcher({ type: 'CLEAR_SELECTION' });
    } else if (event.target.isType('activeSelection')) {
      canvasCtxState.canvasHandler.removeBackgroundImageFromActiveObjects();
      canvasCtxState.canvasHandler.lockActiveSelectionMovement();
      canvasCtxDispatcher({
        type: 'SET_OBJECT',
        payload: { selectedObject: canvasCtxState.canvasHandler.activeObject }
      });
      canvasCtxDispatcher({ type: 'SET_OBJECTS', payload: { selectedObjects: event['selected'] } });
      canvasCtxDispatcher({ type: 'SET_IS_ACTIVE_SELECTION', payload: { isActiveSelection: true } });
    } else {
      canvasCtxDispatcher({ type: 'SET_OBJECT', payload: { selectedObject: event.target } });
      canvasCtxDispatcher({ type: 'SET_OBJECTS', payload: { selectedObjects: event['selected'] } });
      canvasCtxDispatcher({ type: 'SET_IS_ACTIVE_SELECTION', payload: { isActiveSelection: false } });
      canvasCtxDispatcher({
        type: 'SET_IS_WORKAREA_BACKGROUND_MODIFIED',
        payload: { isWorkareaBackgroundModified: canvasCtxState.canvasHandler.isWorkareaBackgroundModified }
      });
    }
  };

  const handleObjectModified = (event: fabric.IEvent) => {
    const { target } = event;
    // Handle Workarea Background Image modification
    if (target.name === 'workareaBackground' && target.isType('image')) {
      canvasCtxDispatcher({
        type: 'SET_IS_WORKAREA_BACKGROUND_MODIFIED',
        payload: { isWorkareaBackgroundModified: canvasCtxState.canvasHandler.isWorkareaBackgroundModified }
      });
    } else if (target.name === 'croppingRect' && target.isType('rect')) {
      canvasCtxState.canvasHandler.setCroppingRectAfterModifed(target as fabric.Rect);
    }
  };

  const handleObjectMoving = (event: fabric.IEvent) => {
    const { target } = event;
    // Handle bounding rect for CroppingRect
    if (target.name === 'croppingRect' && target.isType('rect')) {
      canvasCtxState.canvasHandler.handleCroppingRectBoundings(false, true);
    }
  };

  const handleObjectScaling = (event: fabric.IEvent) => {
    const { target, transform } = event;
    // Handle bounding rect for CroppingRect
    if (target.name === 'croppingRect' && target.isType('rect')) {
      canvasCtxState.canvasHandler.handleCroppingRectBoundings(true, false);
    }
  };

  const handleMouseWheel = (event: fabric.IEvent) => {
    event.e.preventDefault();
    event.e.stopPropagation();
    const delta = event.e['deltaY'];
    const mousePosition = new fabric.Point(event.e['offsetX'], event.e['offsetY']);
    canvasCtxState.canvasHandler.zoom(delta, mousePosition);
    canvasCtxDispatcher({ type: 'SET_SCALE_FACTOR', payload: { scaleFactor: canvasCtxState.canvasHandler.zoomLevel } });
  };

  const handleMouseMove = (event: fabric.IEvent) => {
    canvasCtxState.canvasHandler.pan(event.e['clientX'], event.e['clientY']);
  };

  /**
   * Drop
   */
  const handleOnDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const { x, y } = canvasCtxState.canvasHandler.getPointer(event);

    if (editorCtxState.draggingItem && editorCtxState.draggingItem === 'textbox') {
      const object = FabricObjectBuilder().textbox('Text', {
        top: y,
        left: x,
        fontSize: Math.round(40 / canvasCtxState.canvasHandler.zoomLevel),
        fontFamily: 'Courier New',
      });
      canvasCtxState.canvasHandler.addObject(object);
    } else {
      canvasCtxState.canvasHandler.addObject(new fabric.Triangle({
        top: y,
        left: x,
        width: 100 / canvasCtxState.scaleFactor,
        height: 100 / canvasCtxState.scaleFactor,
        fill: '#000'
      }));
    }
  };

  return (
    <StyledLayoutContent>
      <EditorWrapper>
        <EditorContainer ref={containerRef}
                         onDrop={handleOnDrop}
                         onDrag={event => {
                           event.preventDefault();
                         }}>
          <canvas ref={canvasRef} />
        </EditorContainer>
      </EditorWrapper>
    </StyledLayoutContent>
  );
};

const useCanvasDimension = (containerRef: MutableRefObject<HTMLDivElement>) => {
  const context = useContext(EditorContext);

  useEffect(() => {
    const { clientWidth, clientHeight } = containerRef.current;
    context.dispatch({
      type: 'SET_CANVAS_DIMENSION',
      payload: { canvasWidth: clientWidth, canvasHeight: clientHeight }
    });
  }, [context.state.canvasWidth, context.state.canvasHeight]);

  return context;
};

const useFabricCanvas = (
  editorCtxState: IEditorContextState,
  editorCtxDispatcher: Dispatch<ReducerAction<(state: IEditorContextState, action: IEditorContextReducerActions) => Partial<IEditorContextState>>>,
  canvasRef: MutableRefObject<HTMLCanvasElement>
) => {
  const {state, dispatch} = useContext(CanvasContext);

  useEffect(() => {
    if (!editorCtxState.fabricCanvas) {
      const canvas = new fabric.Canvas(canvasRef.current, { ...defaultCanvasOptions });
      const workarea = new fabric.Rect({
        ...defaultWorkareaOptions,
        width: editorCtxState.workareaWidth,
        height: editorCtxState.workareaHeight
      });
      canvas.add(workarea);
      editorCtxDispatcher({ type: 'SET_FABRIC_CANVAS', payload: { fabricCanvas: canvas } });
      editorCtxDispatcher({ type: 'SET_WORKAREA', payload: { workarea } });
    } else {
      editorCtxState.fabricCanvas.setWidth(editorCtxState.canvasWidth).setHeight(editorCtxState.canvasHeight);
      const scaleRatio = state.canvasHandler.calculateScaleRatio(600, 400);
      dispatch({ type: 'SET_SCALE_FACTOR', payload: { scaleFactor: scaleRatio } });
      state.canvasHandler.resetWorkareaDimension(600, 400, scaleRatio);
      editorCtxDispatcher({ type: 'SET_FABRIC_CANVAS', payload: { fabricCanvas: editorCtxState.fabricCanvas } });
    }
  }, [editorCtxState.canvasWidth, editorCtxState.canvasHeight]);

  return {state, dispatch};
};
