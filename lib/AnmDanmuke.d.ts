import { IDmkData } from './interface/IDmkDate.interface';
import { Danmuke } from "./Danmuke";
export declare class AnmDanmuke extends Danmuke {
    originLeft: number;
    currentLeft: number;
    constructor(dmkData: IDmkData, opt: any);
    nextFrame(): void;
}
