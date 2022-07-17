import { DmkCtrl } from './DmkCtrl';
import { IDmkData } from './interface/IDmkDate.interface';
import { ILayerOpt } from "./interface/ILayerOpt.interface";
import { DmkTrack } from './DmkTrack';
import { Danmuke } from './Danmuke';

export class DmkLayer {
  trackList: Array<DmkTrack> = []; 
  private opt: ILayerOpt = {

  };
  count = 0

  constructor(private trackType: any, opt?: ILayerOpt) {
    if (opt) {
      Object.assign(this.opt, opt);
    }
  }

  setDanmukeIn(dmkData: IDmkData, dmkCtr: DmkCtrl) { // 弹幕进场
    return !!this.trackList.find((track: DmkTrack) => {
      if(track.isCanIn(dmkData, dmkCtr)) {
        let dmk: Danmuke = track.getDmkInstance(dmkData, dmkCtr);
        this.count ++;
        track.addDanmuke(dmk);
        return true;
      }
    })
  }

  getAllDmk() {
    return this.trackList.reduce((dmkList, track) => {
      return dmkList.concat(track.getDmkQueue());
    }, [])
  }

  setOption(key: string, value: any) {
    this.opt[key] = value;
  }

  getOption(key: string) {
    return this.opt[key]; 
  }

  genTracks(dmkCtr: DmkCtrl) {
    let trackHeight = this.opt.trackHeight, level = 1;
    this.trackList = [];
    do {
      let track = new this.trackType(level);
      track.init(this, dmkCtr);
      this.trackList.push(track);
      level ++;
      trackHeight += this.opt.trackHeight;
    } while(trackHeight <= dmkCtr.video.height && (!this.opt.trackCount || level < this.opt.trackCount)) 
  }


}