import { DmkCtr } from '../DmkCtr';
export interface IDmkFrame {
    nextFrame(ctr?: DmkCtr): void;
    isDead(): boolean;
}
