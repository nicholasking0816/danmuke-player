import { DmkCtr } from './DmkCtr';
import { IDmkData } from './interface/IDmkDate.interface';
import { IDmkFrame } from './interface/IDmkFrame.interface';
export abstract class Danmuke implements IDmkFrame {
  isInView: boolean = false;
  content: string;
  opt: any;
  styles: any;
  _isDead: boolean;
  dmkData: IDmkData;
  constructor(dmkData: IDmkData) {
    this.dmkData = dmkData;
    this.content = dmkData.content;
  }

  isDead() {
    return this._isDead;
  }

  outView() {
    this.isInView = false;
  }

  abstract nextFrame(ctr: DmkCtr): void
}