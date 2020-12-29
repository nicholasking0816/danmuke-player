import { StaticDanmuke } from './StaticDanmuke';
import { DmkCtr } from './DmkCtr';
import { IDmkData } from "./interface/IDmkDate.interface";
import { DmkTrack } from "./DmkTrack";
import { Danmuke } from './Danmuke';
import { DmkLayer } from './DmkLayer';
export declare class StaticDmkTrack extends DmkTrack {
    canShow: boolean;
    constructor(level: number);
    init(dmkLayer: DmkLayer, ctr: DmkCtr): void;
    getDmkInstance(dmkData: IDmkData, ctr: DmkCtr): StaticDanmuke;
    isCanIn(dmkData: IDmkData, ctr: DmkCtr): boolean;
    isCanOut(dmk: Danmuke): any;
}
