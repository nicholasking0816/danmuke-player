import { AnimationDesc } from "./AdvanceDanmukeUtil";

export abstract class AnimationPlayer {
    context: any;
    private _delay: number;
    private _timestamp: number;
    private _isCanPlay = false;

    private _stepCount: number;
    constructor(desc: AnimationDesc) {
        this._delay = desc.delay;
        this._timestamp = Date.now();
    }

    setStepCount(value) {
        this._stepCount = value
    }

    getStepCount() {
        return this._stepCount;
    }

    descentStepCount() {
        this._stepCount --;
    }

    canPlay() {
        let delay = Date.now() - this._timestamp;
        return this._isCanPlay || (this._isCanPlay = (delay >= this._delay * 1000))
    }

    getDelay() {
        return this._delay || 0;
    }

    isComplete() {
        return this._stepCount <= 0;
    }

    abstract play(): any;
}