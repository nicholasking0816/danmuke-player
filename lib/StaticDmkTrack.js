import { StaticDanmuke } from './StaticDanmuke';
import { DmkTrack } from "./DmkTrack";
export class StaticDmkTrack extends DmkTrack {
    constructor(level) {
        super(level);
        this.canShow = true;
    }
    init(dmkLayer, ctr) {
    }
    getDmkInstance(dmkData, ctr) {
        return new StaticDanmuke(dmkData, this, {
            top: (this.level - 1) * 30,
            left: ctr.video.width,
            width: dmkData.size.width,
            videoWidth: ctr.video.width,
            lineHeight: ctr.opt.lineHeight || 30,
            fontSize: ctr.opt.fontSize || 25,
            height: dmkData.size.height,
        });
    }
    isCanIn(dmkData, ctr) {
        let isCanIn = dmkData.isUnConsume && (!this.getLast() || this.getLast().isInView);
        return isCanIn;
    }
    isCanOut(dmk) {
        return dmk.opt.isCanOut;
    }
}
