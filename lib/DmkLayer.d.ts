import { DmkCtr } from './DmkCtr';
import { IDmkData } from './interface/IDmkDate.interface';
import { ILayerOpt } from "./interface/ILayerOpt.interface";
import { DmkTrack } from './DmkTrack';
export declare class DmkLayer {
    private trackType;
    trackList: Array<DmkTrack>;
    private opt;
    count: number;
    constructor(trackType: any, opt?: ILayerOpt);
    setDanmukeIn(dmkData: IDmkData, dmkCtr: DmkCtr): boolean;
    getAllDmk(): any[];
    setOption(key: string, value: any): void;
    getOption(key: string): any;
    genTracks(dmkCtr: DmkCtr): void;
}
