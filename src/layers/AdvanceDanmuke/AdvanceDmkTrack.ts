import { Danmuke } from '../../Danmuke';
import { DmkCtrl } from '../../DmkCtrl';
import { DmkLayer } from '../../DmkLayer';
import { DmkTrack } from '../../DmkTrack';
import { AdvanceDanmuke } from './AdvanceDanmuke';
 
export class AdvanceDmkTrack extends DmkTrack {
    constructor(level) {
        super(level)
    }

    init(dmkLayer: DmkLayer, ctr: DmkCtrl) {

    }

    isCanPlay() {
        // return !(this.getDmkQueue() as Array<AdvanceDanmuke>).find(dmk => dmk.isCanPlay && dmk.getCurPos().top < 50)
    }

    getDmkInstance(dmkData: any, ctr: DmkCtrl) {
        return new AdvanceDanmuke(dmkData, this, ctr);
    }

    isCanIn(dmkData: any, ctr: DmkCtrl): boolean {
        return true;
    }

    isCanOut(dmk: Danmuke): boolean {
        return dmk.isDead();
    }
}