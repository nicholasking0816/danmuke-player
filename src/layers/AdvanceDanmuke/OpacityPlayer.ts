import { AnimationDesc } from "./AdvanceDanmukeUtil";
import { AnimationPlayer } from "./AnimationPlayer";

export class OpacityAnimation extends AnimationPlayer {
    constructor(desc: AnimationDesc) {
        super(desc)
        this._createContext(desc);
    }

    private _createContext(desc: AnimationDesc) {
        this.context = {
            opacity: desc.from.opacity
        }
        let stepCount = desc.duration * 60 || 1;
        let gap = desc.to.opacity - desc.from.opacity;
        this.context.step = gap / stepCount;
        this.setStepCount(stepCount);
    }
    
    play() {
        if  (this.isComplete()) return {};
        this.context.opacity += this.context.step;
        this.descentStepCount();
        return {
            opacity: this.context.opacity
        }
    }
}