import { AnmDanmuke } from './AnmDanmuke';
import { DmkUtil } from './DmkUtil';
import { IDmkFrame } from './interface/IDmkFrame.interface';
import { IDmkData } from "./interface/IDmkDate.interface";
import { Danmuke } from "./Danmuke";
import { DmkCtrl } from "./DmkCtrl";
import { DmkTrack } from "./DmkTrack";
import { DmkLayer } from './DmkLayer';

declare const window: any;

export class AnmDmkTrack extends DmkTrack implements IDmkFrame {
  private _ctr: DmkLayer;
  private _baseSize: any;
  layer: DmkLayer;
  constructor(level: number) {
    super(level);
  }

  init(dmkLayer: DmkLayer, ctr: DmkCtrl) {
    this._ctr = dmkLayer;
    this._baseSize = DmkUtil.measureSize('啊', ctr.opt.fontSize, ctr.opt.lineHeight);
  }

  getDmkInstance(dmkData: IDmkData, ctr: DmkCtrl) {
    let multiple =  (dmkData.size.width + ctr.video.width) / (this._baseSize.width + ctr.video.width);
    let opt: any = {
      left: ctr.video.width,
      top: (this.level - 1) * ctr.opt.trackHeight,
      width: dmkData.size.width,
      height: dmkData.size.height,
      lineHeight: ctr.opt.lineHeight,
      fontSize: ctr.opt.fontSize,
      speed: ctr.opt.baseSpeed * multiple
    }
    return new AnmDanmuke(dmkData, this, ctr,opt);
  }

  isDead() {
    return false;
  }

  isCanIn(dmkData: IDmkData, ctr: DmkCtrl) {
    if (!this.getLast()) return true;
    if (!this.getLast().isInView) return false;
    if (dmkData.content.length > this.getLast().content.length) {
      let instance = this.getDmkInstance(dmkData, ctr);
      return !DmkUtil.ifCanCatchUp(
        {
          position: ctr.video.width - instance.currentLeft,
          speed: instance.opt.speed
        },
        {
          position: ctr.video.width - (<AnmDanmuke>this.getLast()).currentLeft - this.getLast().opt.width,
          speed: this.getLast().opt.speed 
        },
        ctr.video.width
      )
    }
    return true;
  }

  isCanOut(dmk: Danmuke) {
    return (<AnmDanmuke>dmk).currentLeft  + dmk.opt.width < 0;
  }
}