import { StaticDanmuke } from './StaticDanmuke';
import { DmkCtr } from './DmkCtr';
import { IDmkData } from "./interface/IDmkDate.interface";
import { DmkTrack } from "./DmkTrack";
import { Danmuke } from './Danmuke';
import { DmkLayer } from './DmkLayer';

export class StaticDmkTrack extends DmkTrack {
  canShow = true;
  constructor(level: number) {
    super(level);
  }

  init(dmkLayer: DmkLayer, ctr: DmkCtr) {

  }

  getDmkInstance(dmkData: IDmkData, ctr: DmkCtr) {
    return new StaticDanmuke(dmkData, this, {
      top: (this.level - 1) * 30,
      left: ctr.video.width,
      width: dmkData.size.width,
      videoWidth: ctr.video.width,
      lineHeight: ctr.opt.lineHeight || 30,
      fontSize: ctr.opt.fontSize || 25,
      height: dmkData.size.height,
    })
  }

  isCanIn(dmkData: IDmkData, ctr: DmkCtr) {
    let isCanIn = dmkData.isUnConsume && (!this.getLast() || this.getLast().isInView);
    return isCanIn;
  }

  isCanOut(dmk: Danmuke) {
    return dmk.opt.isCanOut;
  }
}