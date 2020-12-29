import { IDmkData } from './interface/IDmkDate.interface';
import { Danmuke } from "./Danmuke";

export class AnmDanmuke extends Danmuke {
  originLeft: number;
  currentLeft: number;
  constructor(dmkData: IDmkData, opt: any) {
    super(dmkData);
    this.opt = opt;
    this.styles = {};
    ['left', 'top', 'width', 'height', 'fontSize', 'lineHeight'].forEach(key => this.styles[key] = opt[key] + 'px');
    this.originLeft = this.currentLeft = opt.left;
  }
  nextFrame() {
    this.currentLeft -= this.opt.speed;
    this.styles.transform = `translate3D(${this.currentLeft - this.originLeft}px, 0, 0)`;
    this.isInView = this.originLeft - this.currentLeft > this.opt.width;
  }
}