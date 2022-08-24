import { IDmkData } from './interface/IDmkDate.interface';
import { StaticDmkTrack } from './StaticDmkTrack';
import { Danmuke } from "./Danmuke";
import { DmkCtrl } from './DmkCtrl';

export class StaticDanmuke extends Danmuke {
  constructor(dmkData: IDmkData, private tract: StaticDmkTrack, ctrl: DmkCtrl, opt: any) {
    super(dmkData, tract, ctrl);
    this.opt = {
      isCanOut: false, 
      videoWidth: opt.videoWidth,
      width: opt.width
    };
    
    ['left', 'top', 'width', 'height', 'fontSize', 'lineHeight'].forEach(key => this.styles[key] = dmkData[key] || opt[key] + 'px');
    ['color'].forEach(key => this.styles[key] = dmkData[key] || opt[key]);
    this.styles.zIndex = '102'
  }
  nextFrame() {
    if (this.isInView || !this.tract.canShow) {
      return;
    }
    this.styles.transform = `translate3D(${-(this.opt.videoWidth - this.opt.width) / 2 - this.opt.width}px, 0, 0)`;
    this.isInView = true;
    this.tract.canShow = false;
    setTimeout(() => {
      this.styles.display = 'none',
      this.tract.canShow = true
    }, 1000);
  }
}