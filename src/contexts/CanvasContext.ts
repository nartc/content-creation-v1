import { fabric } from 'fabric';
import { createContext, Dispatch, ReducerAction, useReducer } from 'react';
import { CanvasHandler, FabricObjectBuilder } from '../utils/fabric';
import { IEditorContextState } from './EditorContext';

export interface ICanvasContextState {
  canvasHandler: CanvasHandler;
  workareaBackgroundColor: string;
  isWorkareaBackgroundModified: boolean;
  workareaOpacity: number;
  selectedObject: fabric.Object;
  selectedObjects: fabric.Object[];
  isActiveSelection: boolean;
  scaleFactor: number;
  isInCroppingMode: boolean;
}

export interface ICanvasContext {
  state: ICanvasContextState;
  dispatch: Dispatch<ReducerAction<(state: ICanvasContextState, action: ICanvasContextReducerActions) => Partial<ICanvasContextState>>>;
}

export interface ICanvasContextReducerActions {
  type: 'SET_OBJECT'
    | 'SET_OBJECTS'
    | 'SET_WORKAREA_BACKGROUND'
    | 'SET_IS_WORKAREA_BACKGROUND_MODIFIED'
    | 'SET_WORKAREA_OPACITY'
    | 'SET_SCALE_FACTOR'
    | 'SET_IS_ACTIVE_SELECTION'
    | 'SET_IS_IN_CROPPING_MODE'
    | 'CLEAR_SELECTION';
  payload?: Partial<ICanvasContextState>;
}

const canvasContextReducer = (state: ICanvasContextState, action: ICanvasContextReducerActions) => {
  switch (action.type) {
    case 'CLEAR_SELECTION':
      return {
        ...state,
        selectedObject: null,
        selectedObjects: [],
        isActiveSelection: false,
        isWorkareaBackgroundModified: false,
        isInCroppingMode: false
      };
    case 'SET_OBJECT':
      let { selectedObject } = action.payload;

      if (!selectedObject || selectedObject.isType('rect') && selectedObject.name === 'workarea') {
        selectedObject = null;
      } else {
        if (selectedObject.isType('textbox')) {
          selectedObject = FabricObjectBuilder().textbox(selectedObject['text'], { ...selectedObject.toJSON() });
        } else if (selectedObject.isType('activeSelection')) {
          selectedObject = FabricObjectBuilder().activeSelection((selectedObject as fabric.ActiveSelection).getObjects(), { ...selectedObject.toJSON() });
        }
      }

      return {
        ...state,
        selectedObject
      };
    case 'SET_OBJECTS':
      return {
        ...state,
        selectedObjects: action.payload.selectedObjects
      };
    case 'SET_WORKAREA_BACKGROUND':
      return {
        ...state,
        workareaBackgroundColor: action.payload.workareaBackgroundColor
      };
    case 'SET_IS_WORKAREA_BACKGROUND_MODIFIED':
      return {
        ...state,
        isWorkareaBackgroundModified: action.payload.isWorkareaBackgroundModified
      };
    case 'SET_WORKAREA_OPACITY':
      return {
        ...state,
        workareaOpacity: action.payload.workareaOpacity
      };
    case 'SET_SCALE_FACTOR':
      return {
        ...state,
        scaleFactor: action.payload.scaleFactor
      };
    case 'SET_IS_ACTIVE_SELECTION':
      return {
        ...state,
        isActiveSelection: action.payload.isActiveSelection
      };
    case 'SET_IS_IN_CROPPING_MODE':
      return {
        ...state,
        isInCroppingMode: action.payload.isInCroppingMode
      };
    default:
      return state;
  }
};

export const useCanvasContext = (editorContextState: IEditorContextState) => {
  const [state, dispatch] = useReducer(canvasContextReducer, {
    scaleFactor: 1,
    selectedObjects: [],
    selectedObject: undefined,
    isActiveSelection: false,
    workareaBackgroundColor: '#fff',
    isWorkareaBackgroundModified: false,
    workareaOpacity: 1,
    canvasHandler: new CanvasHandler(editorContextState.fabricCanvas, editorContextState.workarea),
    isInCroppingMode: false
  });

  // TODO: Investigate why canvasHandler's canvas and workarea is undefined here even though it's already been
  //       initialized with editorContextState.fabricCanvas and workarea.
  //       Having to check for undefined and reassign is a workaround for now.
  if (!state.canvasHandler.workarea || !state.canvasHandler.canvas) {
    state.canvasHandler.canvas = editorContextState.fabricCanvas;
    state.canvasHandler.workarea = editorContextState.workarea;
  }

  const canvasCtxState: ICanvasContextState = {
    canvasHandler: state.canvasHandler,
    selectedObject: state.selectedObject,
    scaleFactor: state.scaleFactor,
    selectedObjects: state.selectedObjects,
    isActiveSelection: state.isActiveSelection,
    workareaBackgroundColor: state.workareaBackgroundColor,
    isWorkareaBackgroundModified: state.isWorkareaBackgroundModified,
    workareaOpacity: state.workareaOpacity,
    isInCroppingMode: state.isInCroppingMode
  };

  return { canvasCtxState, dispatch };
};

export const CanvasContext = createContext<ICanvasContext>(null);
