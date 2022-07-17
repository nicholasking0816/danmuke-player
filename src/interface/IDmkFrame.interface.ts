import { DmkCtrl } from '../DmkCtrl';
export interface IDmkFrame {
  nextFrame(ctr?: DmkCtrl): void;
  isDead(): boolean;
}