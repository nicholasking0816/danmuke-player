import { DmkCtrl } from './DmkCtrl';
import { DmkTrack } from './DmkTrack';
import { IDmkData } from './interface/IDmkDate.interface';
import { IDmkFrame } from './interface/IDmkFrame.interface';
export abstract class Danmuke implements IDmkFrame {
  isInView: boolean = false;
  content: string;
  track: DmkTrack;
  ctrl: DmkCtrl;
  opt: any;
  styles: any;
  _isDead: boolean;
  dmkData: IDmkData;
  constructor(dmkData: IDmkData, track: DmkTrack, ctrl: DmkCtrl) {
    this.dmkData = dmkData;
    this.content = dmkData.content;
    this.track = track;
    this.ctrl = ctrl;
  }

  isDead() {
    return this._isDead;
  }

  dead() {
    this._isDead = true;
  }

  outView() {
    this.isInView = false;
  }

  abstract nextFrame(ctr: DmkCtrl): void
}