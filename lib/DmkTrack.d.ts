import { IDmkFrame } from './interface/IDmkFrame.interface';
import { DmkCtr } from './DmkCtr';
import { IDmkData } from "./interface/IDmkDate.interface";
import { Danmuke } from './Danmuke';
import { DmkLayer } from './DmkLayer';
export declare abstract class DmkTrack implements IDmkFrame {
    private _dmkQueue;
    level: number;
    constructor(level: number);
    addDanmuke(dmk: Danmuke): void;
    isDead(): boolean;
    nextFrame(): void;
    getDmkQueue(): Danmuke[];
    getLast(): Danmuke;
    abstract init(dmkLayer: DmkLayer, ctr: DmkCtr): void;
    abstract getDmkInstance(dmkData: IDmkData, ctr: DmkCtr): Danmuke;
    abstract isCanIn(dmkData: IDmkData, ctr: DmkCtr): boolean;
    abstract isCanOut(dmkData: Danmuke): boolean;
}
