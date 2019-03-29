import { fabric } from 'fabric';
import { FabricObjectBuilder } from './FabricObjectBuilder';

export type AlignmentType = 'left' | 'right' | 'bottom' | 'top' | 'vertical' | 'horizontal';
export type LayerType = 'forward' | 'backward' | 'front' | 'back';
export type FlipType = 'vertical' | 'horizontal';

export class CanvasHandler {
  isDragging: boolean;
  lastPositionX: number;
  lastPositionY: number;

  private initialViewportTransform = [1, 0, 0, 1, 0, 0];
  private workareaBackground: fabric.Image;
  private croppingRect: fabric.Rect;

  constructor(private fabricCanvas: fabric.Canvas, private _workarea: fabric.Rect) {
  }

  get canvas(): fabric.Canvas {
    return this.fabricCanvas;
  }

  set canvas(value: fabric.Canvas) {
    this.fabricCanvas = value;
  }

  get workarea(): fabric.Rect {
    return this._workarea;
  }

  set workarea(value: fabric.Rect) {
    this._workarea = value;
  }

  calculateScaleRatio = (newWidth: number, newHeight: number) => {
    return Math.min((this.canvasWidth * .8) / newWidth, (this.canvasHeight * .8) / newHeight);
  };

  resetWorkareaBackground = (color: string) => {
    this._workarea.set('fill', color);
    this.render(true);
  };

  resetWorkareaImageAsBackground = () => {
    this.activeObject.set({
      width: this._workarea.width,
      height: this._workarea.height,
      top: this._workarea.top,
      left: this._workarea.left,
      angle: this._workarea.angle,
      scaleX: this._workarea.scaleX,
      scaleY: this._workarea.scaleY
    });
    this.render(true);
  };

  resetWorkareaOpacity = (opacity: number) => {
    this._workarea.set('opacity', opacity);
    this.render(true);
  };

  addBackgroundImage = (image: fabric.Image, scaleRatio: number) => {
    const { width, height } = image;
    this.resetWorkareaDimension(width, height, scaleRatio);
    image.set({
      top: this._workarea.top,
      left: this._workarea.left,
      name: 'workareaBackground'
    });
    this.fabricCanvas.insertAt(image, 1, false);
    this.workareaBackground = image;
  };

  initializeWorkareaBackgroundCropping = () => {
    if (!this.workareaBackground) {
      return;
    }

    this.croppingRect = FabricObjectBuilder().rect(null, {
      top: this._workarea.top,
      left: this._workarea.left,
      width: this._workarea.width,
      height: this._workarea.height,
      scaleX: this._workarea.scaleX,
      scaleY: this._workarea.scaleY,
      opacity: 0.2,
      lockRotation: true,
      hasRotatingPoint: false,
      name: 'croppingRect'
    });

    this.addObject(this.croppingRect);
    this.fabricCanvas.setActiveObject(this.croppingRect);
    this.workareaBackground.set('selectable', false);
  };

  removeCroppingRect = () => {
    this.removeObject(this.croppingRect);
    this.workareaBackground.set('selectable', true);
    this.croppingRect = null;
  };

  handleCroppingRectBoundings = (isScaling: boolean, isMoving: boolean) => {
    const { left, top, width, height } = this.workarea.getBoundingRect(true, true);
    const { left: objectLeft, top: objectTop, width: objectWidth, height: objectHeight, scaleX, scaleY } = this.activeObject;

    console.log({ left, top, width, height }, this.activeObject.getBoundingRect(true, true));

    if (left > objectLeft) {
      this.activeObject.set('left', left);
    }

    if (top > objectTop) {
      this.activeObject.set('top', top);
    }

    if (objectLeft > left + width - this.activeObject.getScaledWidth()) {
      this.activeObject.set('left', left + width - this.activeObject.getScaledWidth());

      if (isScaling) {
        this.activeObject.set('width', left + width - objectLeft);
      }
    }

    if (objectTop > top + height - (objectHeight * scaleY)) {
      this.activeObject.set('top', top + height - (objectHeight * scaleY));
      // if (isScaling) {
      //   this.activeObject.set('height', objectHeight * scaleY);
      // }
    }

    // if (objectLeft + (objectWidth * scaleX) > left + width) {
    //
    // }

    // if (objectWidth * scaleX > width) {
    //   this.activeObject.set('width', width);
    // }
    //
    // if (objectHeight * scaleY > height) {
    //   this.activeObject.set('height', height);
    // }

    this.render(true);
  };

  resetWorkareaDimension = (width: number, height: number, scaleRatio?: number) => {
    if (!scaleRatio) {
      scaleRatio = this.calculateScaleRatio(width, height);
    }

    this._workarea.set({
      width,
      height
    });

    this.fabricCanvas.setViewportTransform(this.initialViewportTransform);
    this.fabricCanvas.zoomToPoint(new fabric.Point(this.canvasWidth / 2, this.canvasHeight / 2), scaleRatio);
    if (this.fabricCanvas.getObjects().length > 1) {
      const [workarea, ...objects] = this.fabricCanvas.getObjects();
      this.scaleObjects(scaleRatio, objects);
    }

    this.centerWorkareaAndRender();
  };

  // TODO: Fix object position after scaling
  private scaleObjects = (scaleRatio: number, objects: fabric.Object[]) => {
    for (let i = 0, length = objects.length; i < length; i++) {
      const object = objects[i];
      if (object.name === 'workareaBackground') continue;
      if (object.isType('textbox')) {
        const textbox = object as fabric.Textbox;
        textbox.set({
          fontSize: Math.round(textbox.fontSize / scaleRatio),
          width: textbox.width / scaleRatio,
          height: textbox.height / scaleRatio,
          top: this.canvasHeight / 2,
          left: this.canvasWidth / 2
        }).setCoords();
      } else if (object.isType('group')) { // TODO: Fix bug with scaling a group
        const group = object as fabric.Group;
        group.set({
          top: this.canvasHeight / 2,
          left: this.canvasWidth / 2,
        }).setCoords();
        group.scale(1 / scaleRatio);
        group.setObjectsCoords();
      } else {
        object.set({
          width: object.width / scaleRatio,
          height: object.height / scaleRatio,
          top: this.canvasHeight / 2,
          left: this.canvasWidth / 2,
        }).setCoords();
      }
    }
  };

  centerWorkareaAndRender = () => {
    this.fabricCanvas.centerObject(this._workarea);
    this.render();
  };

  addObject = (object: fabric.Object) => {
    this.fabricCanvas.add(object);
  };

  removeObject = (object: fabric.Object) => {
    this.fabricCanvas.remove(object);
  };

  set = <T extends fabric.Object = fabric.Object>(changedKey: keyof T | any, value: any, isActiveSelection: boolean = false) => {
    if (isActiveSelection) {
      for (let i = 0; i < this.activeObjects.length; i++) {
        const object = this.activeObjects[i];
        object.set(changedKey, value);
      }
    }

    const object = this.activeObject;
    object.set(changedKey, value);
    this.render();
  };

  render = (isRequested: boolean = false) => {
    if (isRequested) {
      this.fabricCanvas.requestRenderAll();
      return;
    }
    this.fabricCanvas.renderAll();
  };

  alignObject = (type: AlignmentType) => {
    if (!this.activeObject || !this.activeObjects) {
      return;
    }

    const { left, top, width, height } = this._workarea;
    const { width: objectWidth, height: objectHeight } = this.activeObject;

    switch (type) {
      case 'left':
        this.activeObject.set('left', left).setCoords();
        break;
      case 'right':
        this.activeObject.set('left', left + width - objectWidth).setCoords();
        break;
      case 'bottom':
        this.activeObject.set('top', top + height - objectHeight).setCoords();
        break;
      case 'top':
        this.activeObject.set('top', top).setCoords();
        break;
      case 'vertical':
        this.activeObject.set('left', this._workarea.getCenterPoint().x - (objectWidth / 2)).setCoords();
        break;
      case 'horizontal':
        this.activeObject.set('top', this._workarea.getCenterPoint().y - (objectHeight / 2)).setCoords();
        break;
    }

    this.render(true);
  };

  orderObject = (type: LayerType) => {
    if (!this.activeObject || !this.activeObjects) {
      return;
    }

    switch (type) {
      case 'forward':
        this.activeObject.bringForward();
        break;
      case 'backward':
        this.activeObject.sendBackwards();
        this._workarea.sendToBack();
        break;
      case 'front':
        this.activeObject.bringToFront();
        break;
      case 'back':
        this.activeObject.sendToBack();
        this._workarea.sendToBack();
        break;
    }

    this.render(true);
  };

  flipObject = (type: FlipType) => {
    if (!this.activeObject || !this.activeObjects) {
      return;
    }

    switch (type) {
      case 'vertical':
        this.activeObject.set('flipX', !this.activeObject.flipX);
        break;
      case 'horizontal':
        this.activeObject.set('flipY', !this.activeObject.flipY);
        break;
    }

    this.render(true);
  };

  groupObjects = () => {
    if (!this.activeObject || !this.activeObjects) {
      return;
    }

    if (!this.activeObject.isType('activeSelection')) {
      return;
    }

    this.activeSelection.toGroup();
    this.render(true);
  };

  ungroupObjects = () => {
    if (!this.activeObject || !this.activeObjects) {
      return;
    }

    if (!this.activeObject.isType('group')) {
      return;
    }

    this.activeSelection.toActiveSelection();
    this.render(true);
  };

  toggleLockObject = (toggledState: boolean) => {
    if (!this.activeObject || !this.activeObjects) {
      return;
    }

    this.activeObject.set({
      lockMovementX: toggledState,
      lockMovementY: toggledState,
      lockRotation: toggledState,
      lockScalingFlip: toggledState,
      lockScalingX: toggledState,
      lockScalingY: toggledState,
      lockSkewingX: toggledState,
      lockSkewingY: toggledState,
      lockUniScaling: toggledState,
      hasControls: !toggledState,
      hasRotatingPoint: !toggledState,
    });

    if (this.activeObject.isType('textbox')) {
      this.activeTextbox.set('editable', !toggledState);
    }

    this.render(true);
  };

  duplicateObject = () => {
    this.activeObject.clone(cloned => {
      this.fabricCanvas.discardActiveObject();
      cloned.set({
        top: cloned.top + 10,
        left: cloned.left + 10,
        evented: true
      });

      if (cloned.isType('activeSelection')) {
        cloned.set('canvas', this.fabricCanvas);
        cloned.forEachObject(this.addObject);
        cloned.setCoords().setObjectsCoords();
      } else {
        this.addObject(cloned);
      }

      this.fabricCanvas.setActiveObject(cloned);
      this.render(true);
    }, ['userProperty', 'resource', 'name']);
  };

  deleteObject = () => {
    if (!this.activeObject) {
      return;
    }

    if (this.activeObject.isType('activeSelection')) {
      (<fabric.ActiveSelection>this.activeObject).forEachObject(this.removeObject);
    } else {
      if (this.activeObject.isType('image') && this.activeObject.name === 'workareaBackground') {
        this.workareaBackground = null;
      }
      this.removeObject(this.activeObject);
    }

    this.fabricCanvas.discardActiveObject();
    this.render(true);
  };

  zoom = (delta: number, mousePosition: fabric.Point) => {
    const currentZoom = this.fabricCanvas.getZoom();
    let newZoom = currentZoom + delta / 200;

    if (newZoom > 20) newZoom = 20;
    if (newZoom < 0.2) newZoom = 0.2;

    this.fabricCanvas.zoomToPoint(mousePosition, newZoom);
  };

  pan = (clientX: number, clientY: number) => {
    if (this.isDragging) {
      const panPosition = new fabric.Point(clientX - this.lastPositionX, clientY - this.lastPositionY);
      this.lastPositionX = clientX;
      this.lastPositionY = clientY;
      this.fabricCanvas.relativePan(panPosition);
    }
  };

  setSelection = (value: boolean) => {
    this.fabricCanvas.selection = value;
  };

  removeBackgroundImageFromActiveObjects = () => {
    (<fabric.ActiveSelection>this.activeObject).removeWithUpdate(this.workareaBackground);
    this.render(true);
  };

  lockActiveSelectionMovement = () => {
    if (!this.activeObject || !this.activeObjects) {
      return;
    }

    if (!this.activeObject.isType('activeSelection')) {
      return;
    }

    this.activeObject.set({
      lockMovementX: true,
      lockMovementY: true,
      hasControls: false,
      hasRotatingPoint: false,
    });
  };

  /**
   * Getters
   */
  private getActiveObject = <T extends fabric.Object = fabric.Object>() => {
    return this.fabricCanvas.getActiveObject() as T;
  };

  get canvasWidth(): number {
    return this.fabricCanvas.getWidth();
  }

  get canvasHeight(): number {
    return this.fabricCanvas.getHeight();
  }

  get activeTextbox(): fabric.Textbox {
    return this.getActiveObject<fabric.Textbox>();
  };

  get activeObject(): fabric.Object {
    return this.getActiveObject();
  }

  get activeSelection(): fabric.ActiveSelection {
    return this.getActiveObject<fabric.ActiveSelection>();
  }

  get activeObjects(): fabric.Object[] {
    return this.fabricCanvas.getActiveObjects();
  }

  get isActiveObjectLocked(): boolean {
    if (this.fabricCanvas && this.activeObject) {
      const { lockUniScaling, lockSkewingY, lockSkewingX, lockScalingY, lockScalingX, lockScalingFlip, lockRotation, lockMovementY, lockMovementX } = this.activeObject;
      return lockUniScaling && lockSkewingY && lockSkewingX && lockScalingY && lockScalingX && lockScalingFlip && lockRotation && lockMovementY && lockMovementX;
    }

    return false;
  }

  get zoomLevel(): number {
    return this.fabricCanvas.getZoom();
  }

  get isWorkareaBackgroundModified(): boolean {
    return this.activeObject
      && this.activeObject.isType('image')
      && this.activeObject.name === 'workareaBackground'
      && (
        this.activeObject.top !== this.workarea.top
        || this.activeObject.left !== this.workarea.left
        || this.activeObject.width !== this.workarea.width
        || this.activeObject.height !== this.workarea.height
        || this.activeObject.angle !== this.workarea.angle
      );
  }

  get isInCroppingMode(): boolean {
    return this.activeObject
      && this.activeObject.isType('rect')
      && this.activeObject.name === 'croppingRect';
  }

  getPointer(event: any) {
    return this.fabricCanvas.getPointer(event, false);
  }
}
