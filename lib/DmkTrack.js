export class DmkTrack {
    constructor(level) {
        this._dmkQueue = [];
        this.level = level;
    }
    addDanmuke(dmk) {
        this._dmkQueue.push(dmk);
    }
    isDead() {
        return false;
    }
    nextFrame() {
        let index = 0;
        while (index < this._dmkQueue.length) {
            let dmk = this._dmkQueue[index];
            if (this.isCanOut(dmk)) {
                this._dmkQueue.splice(index, 1);
                dmk._isDead = true;
            }
            else {
                index++;
            }
        }
    }
    getDmkQueue() {
        return this._dmkQueue;
    }
    getLast() {
        if (!this._dmkQueue.length)
            return null;
        return this._dmkQueue[this._dmkQueue.length - 1];
    }
}
