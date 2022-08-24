import { AnimationDesc } from "./AdvanceDanmukeUtil";
import { AnimationPlayer } from "./AnimationPlayer"

export class ScalePlayer extends AnimationPlayer {
    constructor(desc: AnimationDesc) {
        super(desc);
        this._createContext(desc);
    }


    private _createContext(desc: AnimationDesc) {
        this.context = {
            scale: desc.from.scale
        };
        let stepCount = desc.duration * 60 || 1;
        let gap = desc.to.scale - desc.from.scale;
        this.context.step =  (gap - (desc.sA || 0) * (stepCount ** 2) / 2) / stepCount;
        this.context.sA = desc.sA;
        this.setStepCount(stepCount);
    }

    play() {
        if (this.isComplete()) return {};
        this.context.scale += this.context.step;
        this.context.step += (this.context.sA || 0);
        this.descentStepCount();
        return {
            transform: {
                scale: this.context.scale
            }
        }
    }
}