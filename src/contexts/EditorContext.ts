import { fabric } from 'fabric';
import { createContext, Dispatch, ReducerAction, useReducer } from 'react';

export interface IEditorContextState {
  fabricCanvas: fabric.Canvas;
  workarea: fabric.Rect;
  canvasWidth: number;
  canvasHeight: number;
  workareaWidth: number;
  workareaHeight: number;
  draggingItem: string;
}

export interface IEditorContext {
  state: IEditorContextState;
  dispatch: Dispatch<ReducerAction<(state: IEditorContextState, action: IEditorContextReducerActions) => Partial<IEditorContextState>>>;
}

export interface IEditorContextReducerActions {
  type: 'SET_FABRIC_CANVAS' | 'SET_CANVAS_DIMENSION' | 'SET_WORKAREA_DIMENSION' | 'SET_DRAGGING_ITEM' | 'SET_WORKAREA';
  payload?: Partial<IEditorContextState>;
}

const editorContextReducer = (state: IEditorContextState, action: IEditorContextReducerActions) => {
  switch (action.type) {
    case 'SET_FABRIC_CANVAS':
      return {
        ...state,
        fabricCanvas: action.payload.fabricCanvas
      };
    case 'SET_WORKAREA':
      return {
        ...state,
        workarea: action.payload.workarea
      };
    case 'SET_CANVAS_DIMENSION':
      return {
        ...state,
        canvasHeight: action.payload.canvasHeight,
        canvasWidth: action.payload.canvasWidth
      };
    case 'SET_WORKAREA_DIMENSION':
      return {
        ...state,
        workareaWidth: action.payload.workareaWidth,
        workareaHeight: action.payload.workareaHeight
      };
    case 'SET_DRAGGING_ITEM':
      return {
        ...state,
        draggingItem: action.payload.draggingItem
      };
    default:
      return state;
  }
};

export const useEditorContext = (workareaWidth: number, workareaHeight: number) => {
  const [state, dispatch] = useReducer(editorContextReducer, {
    workareaHeight,
    workareaWidth,
    canvasWidth: 0,
    canvasHeight: 0,
    draggingItem: '',
    fabricCanvas: undefined,
    workarea: undefined
  });

  const ctxState: IEditorContextState = {
    fabricCanvas: state.fabricCanvas,
    workarea: state.workarea,
    workareaWidth: state.workareaWidth,
    workareaHeight: state.workareaHeight,
    canvasHeight: state.canvasHeight,
    canvasWidth: state.canvasWidth,
    draggingItem: state.draggingItem
  };

  return { ctxState, dispatch };
};

export const EditorContext = createContext<IEditorContext>(null);
