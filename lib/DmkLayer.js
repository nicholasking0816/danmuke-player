export class DmkLayer {
    constructor(trackType, opt) {
        this.trackType = trackType;
        this.trackList = [];
        this.opt = {};
        this.count = 0;
        if (opt) {
            Object.assign(this.opt, opt);
        }
    }
    setDanmukeIn(dmkData, dmkCtr) {
        return !!this.trackList.find((track) => {
            if (track.isCanIn(dmkData, dmkCtr)) {
                let dmk = track.getDmkInstance(dmkData, dmkCtr);
                this.count++;
                track.addDanmuke(dmk);
                dmkCtr.addFrame(dmk);
                return true;
            }
        });
    }
    getAllDmk() {
        return this.trackList.reduce((dmkList, track) => {
            return dmkList.concat(track.getDmkQueue());
        }, []);
    }
    setOption(key, value) {
        this.opt[key] = value;
    }
    getOption(key) {
        return this.opt[key];
    }
    genTracks(dmkCtr) {
        let trackHeight = this.opt.trackHeight, level = 1;
        this.trackList = [];
        do {
            let track = new this.trackType(level);
            track.init(this, dmkCtr);
            dmkCtr.addFrame(track);
            this.trackList.push(track);
            level++;
            trackHeight += this.opt.trackHeight;
        } while (trackHeight <= dmkCtr.video.height);
    }
}
