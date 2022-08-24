import { AnimationDesc } from "./AdvanceDanmukeUtil";
import { AnimationPlayer } from "./AnimationPlayer";

export class RoatePlayer extends AnimationPlayer {
    constructor(desc: AnimationDesc) {
        super(desc);
        this._createContext(desc);
    }


    private _createContext(desc: AnimationDesc) {
        this.context = {
            deg: desc.from.deg
        };
        let stepCount = desc.duration * 60 || 1;
        let angle = desc.to.deg - desc.from.deg;
        this.context.step =  (angle - (desc.rA || 0) * (stepCount ** 2) / 2) / stepCount;
        this.context.rA = desc.rA;
        this.setStepCount(stepCount);
    }

    play() {
        if (this.isComplete()) return {};
        this.context.deg += this.context.step;
        this.context.step += (this.context.rA || 0);
        this.descentStepCount();
        return {
            transform: {
                rotate: this.context.deg + 'deg'
            }
        }
    }
}