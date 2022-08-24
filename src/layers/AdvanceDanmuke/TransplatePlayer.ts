import { AnimationDesc } from "./AdvanceDanmukeUtil";
import { AnimationPlayer } from "./AnimationPlayer";

export class TranslatePlayer extends AnimationPlayer{
    constructor(desc: AnimationDesc) {
        super(desc);
        this._createContext(desc);
    }

    private _createContext(desc: AnimationDesc) {
        this.context = {
            left: desc.from.left,
            top: desc.from.top,
        };
        let stepCount = desc.duration * 60 || 1;
        let xDistance = desc.to.left - desc.from.left;
        let yDistance = desc.to.top - desc.from.top;
        this.context.xStep = (xDistance - (desc.xA || 0) * (stepCount ** 2) / 2) / stepCount;
        this.context.yStep = (yDistance - (desc.yA || 0) * (stepCount ** 2) / 2) / stepCount;
        this.context.xA = desc.xA;
        this.context.yA = desc.yA;
        this.setStepCount(stepCount);
    }

    play() {
        if (this.isComplete()) return {};
        this.context.left += this.context.xStep;
        this.context.top += this.context.yStep;
        this.context.xStep += (this.context.xA || 0);
        this.context.yStep += (this.context.yA || 0);
        this.descentStepCount();
        return {
            transform: {
                translate: {
                    left: this.context.left + 'px',
                    top: this.context.top + 'px'
                }
            }
            
        }
    }
}