import { IDmkData } from './interface/IDmkDate.interface';
import { StaticDmkTrack } from './StaticDmkTrack';
import { Danmuke } from "./Danmuke";

export class StaticDanmuke extends Danmuke {
  constructor(dmkData: IDmkData, private tract: StaticDmkTrack, opt: any) {
    super(dmkData);
    this.opt = {
      isCanOut: false, 
      videoWidth: opt.videoWidth,
      width: opt.width
    };
    this.styles = {
      top: opt.top + 'px' ,
      left: opt.left + 'px',
      width: opt.width + 'px',
      fontSize: opt.fontSize + 'px',
      lineHeight: opt.lineHeight + 'px',
      color: 'red'
    }
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