import { IDmkData } from '../../interface/IDmkDate.interface';
import { Danmuke } from "../../Danmuke";
import { AnmDmkTrack } from './AnmDmkTrack';
import { DmkCtrl } from '../../DmkCtrl';

export class AnmDanmuke extends Danmuke {
  originLeft: number;
  currentLeft: number;
  constructor(dmkData: IDmkData, track: AnmDmkTrack, ctrl: DmkCtrl, opt: any) {
    super(dmkData, track, ctrl);
    this.opt = opt;
    this.styles = {};
    ['left', 'top', 'width', 'height', 'fontSize', 'lineHeight'].forEach(key => this.styles[key] = dmkData[key] || opt[key] + 'px');
    ['color'].forEach(key => this.styles[key] = dmkData[key] || opt[key])
    this.originLeft = this.currentLeft = opt.left;
    this.styles.position = 'absolute';
    this.styles.zIndex = '101';
  }
  nextFrame() {
    this.currentLeft -= this.opt.speed;
    this.styles.transform = `translate3D(${this.currentLeft - this.originLeft}px, 0, 0)`;
    this.isInView = this.originLeft - this.currentLeft > this.opt.width;
  }
}