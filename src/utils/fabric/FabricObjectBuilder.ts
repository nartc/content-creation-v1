import { fabric } from 'fabric';

export interface FabricObjectOption extends fabric.IObjectOptions {
  resource?: any;
  userProperty?: { [key: string]: any };

  [key: string]: any;
}

const defaultOptions: FabricObjectOption = {
  fill: 'rgba(0, 0, 0, 1)',
  stroke: 'rgba(255, 255, 255, 0)',
  resource: {},
  userProperty: {},
};

type CreateFn<T extends fabric.Object, U extends fabric.IObjectOptions, P> = (param: P, options?: U, callback?: any) => T;

interface ObjectDictionary {
  group: CreateFn<fabric.Group, fabric.IGroupOptions, fabric.Object[]>;
  textbox: CreateFn<fabric.Textbox, fabric.ITextboxOptions, string>;
  image: CreateFn<fabric.Image, fabric.IImageOptions, string | HTMLImageElement>;
  polygon: CreateFn<fabric.Polygon, fabric.IPolylineOptions, Array<{ x: number; y: number }>>;
  line: CreateFn<fabric.Line, fabric.ILineOptions, number[]>;
  activeSelection: CreateFn<fabric.ActiveSelection, fabric.IObjectOptions, fabric.Object[]>;
  rect: CreateFn<fabric.Rect, fabric.IRectOptions, any>;
}

type ObjectBuilder = (merged?: any) => ObjectDictionary;

export const FabricObjectBuilder: ObjectBuilder = (mergedObjects?: any) => {
  const fabricObjects = {
    group: (objects: fabric.Object[], options?: fabric.IGroupOptions) => {
      return new fabric.Group(objects, { ...defaultOptions, ...options });
    },
    textbox: (text: string, options?: fabric.ITextboxOptions) => {
      return new fabric.Textbox(text, { ...defaultOptions, ...options });
    },
    image: (element: string | HTMLImageElement, options?: fabric.IImageOptions, callback?: (image: fabric.Image) => void) => {
      if (typeof element === 'string') {
        if (callback === null) {
          return;
        }
        return fabric.Image.fromURL(element, callback, { ...defaultOptions, ...options });
      }

      return new fabric.Image(element, { ...defaultOptions, ...options });
    },
    rect: (param: any, options?: fabric.IRectOptions) => {
      return new fabric.Rect({ ...defaultOptions, ...options });
    },
    polygon: (points: Array<{ x: number; y: number }>, options?: fabric.IPolylineOptions) => {
      return new fabric.Polygon(points, {
        ...defaultOptions,
        ...options,
        perPixelTargetFind: true,
      });
    },
    line: (points: number[], options?: fabric.ILineOptions) => {
      return new fabric.Line(points, { ...defaultOptions, ...options });
    },
    activeSelection: (objects: fabric.Object[], options?: fabric.IObjectOptions) => {
      return new fabric.ActiveSelection(objects, { ...defaultOptions, ...options });
    }
  };

  if (mergedObjects) {
    Object.assign(fabricObjects, mergedObjects);
  }

  return fabricObjects;
};
