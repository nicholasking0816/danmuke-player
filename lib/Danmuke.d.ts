import { DmkCtr } from './DmkCtr';
import { IDmkData } from './interface/IDmkDate.interface';
import { IDmkFrame } from './interface/IDmkFrame.interface';
export declare abstract class Danmuke implements IDmkFrame {
    isInView: boolean;
    content: string;
    opt: any;
    styles: any;
    _isDead: boolean;
    dmkData: IDmkData;
    constructor(dmkData: IDmkData);
    isDead(): boolean;
    outView(): void;
    abstract nextFrame(ctr: DmkCtr): void;
}
