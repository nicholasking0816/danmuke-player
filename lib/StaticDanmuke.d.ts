import { IDmkData } from './interface/IDmkDate.interface';
import { StaticDmkTrack } from './StaticDmkTrack';
import { Danmuke } from "./Danmuke";
export declare class StaticDanmuke extends Danmuke {
    private tract;
    constructor(dmkData: IDmkData, tract: StaticDmkTrack, opt: any);
    nextFrame(): void;
}
