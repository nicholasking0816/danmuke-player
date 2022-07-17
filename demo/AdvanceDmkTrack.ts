import { Danmuke } from '../src/Danmuke';
import { DmkCtrl } from '../src/DmkCtrl';
import { DmkLayer } from '../src/DmkLayer';
import { DmkTrack } from '../src/DmkTrack';
import { IDmkData } from '../src/interface/IDmkDate.interface';
import { AdvanceDanmuke } from './AdvanceDanmuke';
 
export class AdvanceDmkTrack extends DmkTrack {
    dmkLayer
    constructor(level) {
        super(level)
    }

    init(dmkLayer: DmkLayer, ctr: DmkCtrl) {

    }

    isCanPlay() {
        return !(this.getDmkQueue() as Array<AdvanceDanmuke>).find(dmk => dmk.isCanPlay && dmk.getCurPos().top < 50)
    }

    getDmkInstance(dmkData: IDmkData, ctr: DmkCtrl) {
        return new AdvanceDanmuke(dmkData, this, ctr);
    }

    isCanIn(dmkData: IDmkData, ctr: DmkCtrl): boolean {
        return true;
    }

    isCanOut(dmk: Danmuke): boolean {
        return dmk.isDead();
    }
}