import React, { FC } from 'react';
import { Editor } from './components/Editor/Editor';
import { CanvasContext, EditorContext, useCanvasContext, useEditorContext } from './contexts';

interface IAppProps {
  workareaWidth?: number;
  workareaHeight?: number;
}

const App: FC<IAppProps> = ({ workareaWidth = 600, workareaHeight = 400 }) => {
  /**
   * Setup EditorContext State
   */
  const { ctxState, dispatch } = useEditorContext(workareaWidth, workareaHeight);

  /**
   * Setup Canvas Context State
   */
  const { canvasCtxState, dispatch: canvasDispatch } = useCanvasContext(ctxState);

  return (
    <EditorContext.Provider value={{ state: ctxState, dispatch }}>
      <CanvasContext.Provider value={{ state: canvasCtxState, dispatch: canvasDispatch }}>
        <Editor/>
      </CanvasContext.Provider>
    </EditorContext.Provider>
  );
};

export default App;
