import { IDmkFrame } from './interface/IDmkFrame.interface';
import { DmkFragment } from './DmkFragment';
import { DmkCtr } from './DmkCtr';
import { IDmkData } from "./interface/IDmkDate.interface";
import { Danmuke } from './Danmuke';
import { DmkLayer } from './DmkLayer';

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
        dmk._isDead = true;
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

  abstract init(dmkLayer: DmkLayer, ctr: DmkCtr): void;
  abstract getDmkInstance(dmkData: IDmkData, ctr: DmkCtr): Danmuke;
  abstract isCanIn(dmkData: IDmkData, ctr: DmkCtr): boolean;
  abstract isCanOut(dmkData: Danmuke): boolean;
}