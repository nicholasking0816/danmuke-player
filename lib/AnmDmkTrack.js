import { AnmDanmuke } from './AnmDanmuke';
import { DmkUtil } from './DmkUtil';
import { DmkTrack } from "./DmkTrack";
export class AnmDmkTrack extends DmkTrack {
    constructor(level) {
        super(level);
    }
    init(dmkLayer, ctr) {
        this._ctr = dmkLayer;
        this._baseSize = DmkUtil.measureSize('啊', ctr.opt.fontSize, ctr.opt.lineHeight);
    }
    getDmkInstance(dmkData, ctr) {
        let multiple = (dmkData.size.width + ctr.video.width) / (this._baseSize.width + ctr.video.width);
        let opt = {
            left: ctr.video.width,
            top: (this.level - 1) * ctr.opt.trackHeight,
            width: dmkData.size.width,
            height: dmkData.size.height,
            lineHeight: ctr.opt.lineHeight,
            fontSize: ctr.opt.fontSize,
            speed: ctr.opt.baseSpeed * multiple
        };
        return new AnmDanmuke(dmkData, opt);
    }
    isDead() {
        return false;
    }
    isCanIn(dmkData, ctr) {
        if (!this.getLast())
            return true;
        if (!this.getLast().isInView)
            return false;
        if (dmkData.content.length > this.getLast().content.length) {
            let instance = this.getDmkInstance(dmkData, ctr);
            return !DmkUtil.ifCanCatchUp({
                position: ctr.video.width - instance.currentLeft,
                speed: instance.opt.speed
            }, {
                position: ctr.video.width - this.getLast().currentLeft - this.getLast().opt.width,
                speed: this.getLast().opt.speed
            }, ctr.video.width);
        }
        return true;
    }
    isCanOut(dmk) {
        return dmk.currentLeft + dmk.opt.width < 0;
    }
}
