import { CSSProperties } from 'react';

export interface Font {
  name: string;
  style: Pick<CSSProperties, 'fontFamily'>;
}

export class Fonts {
  private _systemFonts = [
    'Arial',
    'Arial Black',
    'Helvetica',
    'Verdana',
    'Trebuchet MS',
    'Tahoma',
    'MS Sans Serif',
    'Symbol',
    'Times',
    'Times New Roman',
    'MS Serif',
    'New York',
    'Palatino Linotype',
    'Book Antiqua',
    'Georgia',
    'Courier New',
    'Courier',
    'Comic Sans MS',
    'Lucida Console',
    'Impact'
  ];

  private _customFonts = [
    'Nevco VSB'
  ];

  private _fontSizes = [6, 8, 10, 12, 14, 16, 18, 21, 24, 28, 32, 36, 42, 48, 56, 64, 72, 80, 88, 96, 104, 120, 144];

  get fontFaces(): Font[] {
    return this._systemFonts.map(font => ({
      name: font,
      style: { fontFamily: font }
    }));
  }

  get customFontFaces(): Font[] {
    return this._customFonts.map(font => ({
      name: font,
      style: { fontFamily: font }
    }));
  }

  get fontSizes(): number[] {
    return this._fontSizes;
  }
}
