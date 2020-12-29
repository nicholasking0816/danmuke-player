export class Danmuke {
    constructor(dmkData) {
        this.isInView = false;
        this.dmkData = dmkData;
        this.content = dmkData.content;
    }
    isDead() {
        return this._isDead;
    }
    outView() {
        this.isInView = false;
    }
}
