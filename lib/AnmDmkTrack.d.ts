import { AnmDanmuke } from './AnmDanmuke';
import { IDmkFrame } from './interface/IDmkFrame.interface';
import { IDmkData } from "./interface/IDmkDate.interface";
import { Danmuke } from "./Danmuke";
import { DmkCtr } from "./DmkCtr";
import { DmkTrack } from "./DmkTrack";
import { DmkLayer } from './DmkLayer';
export declare class AnmDmkTrack extends DmkTrack implements IDmkFrame {
    private _ctr;
    private _baseSize;
    constructor(level: number);
    init(dmkLayer: DmkLayer, ctr: DmkCtr): void;
    getDmkInstance(dmkData: IDmkData, ctr: DmkCtr): AnmDanmuke;
    isDead(): boolean;
    isCanIn(dmkData: IDmkData, ctr: DmkCtr): boolean;
    isCanOut(dmk: Danmuke): boolean;
}
