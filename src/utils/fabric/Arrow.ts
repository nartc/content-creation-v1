import { fabric } from 'fabric';

export class Arrow extends fabric.Line {
  superType: string;

  constructor(points: number[], options: fabric.ILineOptions = {}) {
    super(points, { ...options });
    this.type = 'arrow';
    this.superType = 'drawing';
  }

  render(ctx: CanvasRenderingContext2D) {
    super.render(ctx);
    ctx.save();
    if (this.x2 && this.x1 && this.y2 && this.y1 && this.stroke) {
      const xDiff = this.x2 - this.x1;
      const yDiff = this.y2 - this.y1;
      const angle = Math.atan2(yDiff, xDiff);
      ctx.translate(xDiff / 2, yDiff / 2);
      ctx.rotate(angle);
      ctx.beginPath();
      // Move 5px in front of line to start the arrow so it does not have the square line end showing in front (0,0)
      ctx.moveTo(5, 0);
      ctx.lineTo(-5, 5);
      ctx.lineTo(-5, -5);
      ctx.closePath();
      ctx.fillStyle = this.stroke;
      ctx.fill();
      ctx.restore();
    }
  }

  static fromObject(object: any): Arrow {
    const { points, ...options } = object;
    return new Arrow(points, options);
  }
}
