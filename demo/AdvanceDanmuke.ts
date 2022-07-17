import { Danmuke } from "../src/Danmuke";
import { DmkCtrl } from "../src/DmkCtrl";
import { DmkTrack } from "../src/DmkTrack";
import { AdvanceDmkTrack } from "./AdvanceDmkTrack";

export class AdvanceDanmuke extends Danmuke {
    private _curLeft: number = 0;
    private _curTop: number = 0;
    private _hDistance: number;
    private _vDistance: number;
    private _hStep: number;
    private _vStep: number;
    isCanPlay = false;
    
    constructor(dmkData: any, track: AdvanceDmkTrack, ctrl: DmkCtrl) {
        super(dmkData, track, ctrl)
        const animation = dmkData.animation;
        if (animation.translate) {
            const from = animation.translate.from;
            const to = animation.translate.to;
            const duration = (animation.translate.duration || 5) * 60;
            const left = from.left;
            const top = from.top;
            this._hDistance = to.left - left;
            this._vDistance = to.top - top;
            this._hStep = this._hDistance / duration;
            this._vStep = this._vDistance / duration;

            this.styles = {
                position: 'absolute',
                left: left + 'px',
                top: top + 'px',
                // display: 'none',
                fontSize: '18px',
                zIndex: 103,
                color: dmkData.color || 'red'
            }
        }
        
    }

    getCurPos() {
        return {
            left: this._curLeft,
            top: this._curTop
        }
    }

    nextFrame(ctr: DmkCtrl) {
        // this.isCanPlay = this.isCanPlay || (this.track as AdvanceDmkTrack).isCanPlay();
        // if (!this.isCanPlay) {
        //     return;
        // } else {
        //     this.styles.display = 'block'
        // }
        this._curLeft += this._hStep;
        this._curTop += this._vStep;
        this.styles.transform = `translate3D(${this._curLeft}px, ${this._curTop}px, 0)`;
        if (Math.abs(this._curLeft) >= Math.abs(this._hDistance) || Math.abs(this._curTop) >= Math.abs(this._vDistance)) {
            this.dead();
        }
    }
}