import { IDmkFrame } from './interface/IDmkFrame.interface';
import { IDmkData } from "./interface/IDmkDate.interface";
import { Danmuke } from './Danmuke';
import { DmkLayer } from './DmkLayer';
import { DmkCtrl } from './DmkCtrl';

export abstract class DmkTrack implements IDmkFrame {
  private _dmkQueue: Array<Danmuke>  = [];
  level: number;
  // queue: Array<>
  constructor(level: number) {
    this.level = level;
  }

  addDanmuke(dmk: Danmuke) {
    this._dmkQueue.push(dmk);
  }

  isDead() {
    return false;
  }

  nextFrame() {
    let index = 0;
    while(index < this._dmkQueue.length) {
      let dmk = this._dmkQueue[index];
      if ( this.isCanOut(dmk)) {
        this._dmkQueue.splice(index, 1);
        dmk.dead();
      } else {
        index ++;
      }
    }
  }

  

  getDmkQueue() {
    return this._dmkQueue;
  }

  getLast() {
    if (!this._dmkQueue.length) return null;
    return this._dmkQueue[this._dmkQueue.length - 1];
  }

  abstract init(dmkLayer: DmkLayer, ctr: DmkCtrl): void;
  abstract getDmkInstance(dmkData: IDmkData, ctr: DmkCtrl): Danmuke;
  abstract isCanIn(dmkData: IDmkData, ctr: DmkCtrl): boolean;
  abstract isCanOut(dmkData: Danmuke): boolean;
}