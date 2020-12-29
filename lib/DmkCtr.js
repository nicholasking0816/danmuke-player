import { DefaultDmkCtrOpt } from './constantData';
import { DmkFragment } from './DmkFragment';
import { DmkUtil } from './DmkUtil';
import { DmkLayer } from './DmkLayer';
import { AnmDmkTrack } from './AnmDmkTrack';
import { StaticDmkTrack } from './StaticDmkTrack';
export class DmkCtr {
    constructor(danmukeList, opt, video) {
        this.opt = opt;
        this.video = video;
        this._frameRecord = 0;
        this._unComsumed = new DmkFragment();
        this._frameHooks = {};
        this._dmkFragments = [];
        this._dmkFrames = [];
        this.layerMap = new Map();
        this._init(danmukeList);
    }
    _normalizeLayerOpt(layer) {
        if (!DmkUtil.isDef(layer.getOption('priority'))) {
            layer.setOption('priority', this.layerMap.size);
        }
        if (!DmkUtil.isDef(layer.getOption('layerLevel'))) {
            layer.setOption('layerLevel', this.layerMap.size);
        }
        if (!DmkUtil.isDef(layer.getOption('width'))) {
            layer.setOption('width', this.video.width);
        }
        if (!DmkUtil.isDef(layer.getOption('height'))) {
            layer.setOption('width', this.video.height);
        }
        if (!DmkUtil.isDef(layer.getOption('trackHeight'))) {
            layer.setOption('trackHeight', this.opt.trackHeight || 32);
        }
    }
    _initOpt() {
        this.opt = Object.assign({}, DefaultDmkCtrOpt, this.opt);
    }
    _init(danmukeList) {
        this._initOpt();
        this.addDmkList(danmukeList);
        let anmDmkLayer = new DmkLayer(AnmDmkTrack, {
            priority: 1,
            layerLevel: 1,
            trackHeight: this.opt.trackHeight
        });
        let staticDmkTrackLayer = new DmkLayer(StaticDmkTrack, {
            priority: 2,
            layerLevel: 2,
            trackHeight: this.opt.trackHeight
        });
        this.addLayer(anmDmkLayer, 'anmDmkLayer');
        this.addLayer(staticDmkTrackLayer, 'staticDmkTrackLayer');
    }
    _setDanmukeIn() {
        let fulledLayerMap = new Map();
        this._currentIdx = DmkUtil.getFragmIdx(this.video.currentTime, this.opt.range);
        let currentFragment = this._dmkFragments[this._currentIdx];
        if (this._currentFragment && this._currentFragment !== currentFragment) {
            this._unComsumed.push(...this._currentFragment.flush());
        }
        this._currentFragment = currentFragment;
        if (!this._currentFragment || !this._currentFragment.restSize())
            return;
        if (!this._currentFragment.isSorted)
            this._currentFragment.sort();
        let sortedLayerList = this.getSortedLayerList(), layerIdx = 0, layer = sortedLayerList[layerIdx];
        while (true) {
            let dmkData = this._currentFragment.get();
            if (dmkData.layer && this.layerMap.has(dmkData.layer) && !fulledLayerMap.get(this.layerMap.get(dmkData.layer))) {
                let layer = this.layerMap.get(dmkData.layer);
                if (!layer.setDanmukeIn(dmkData, this)) {
                    fulledLayerMap.set(layer, true);
                }
                else {
                    this._currentFragment.next();
                }
            }
            else {
                if (!layer.setDanmukeIn(dmkData, this)) {
                    fulledLayerMap.set(layer, true);
                    layer = sortedLayerList[++layerIdx];
                }
                else {
                    this._currentFragment.next();
                }
            }
            if (fulledLayerMap.size === this.layerMap.size || !this._currentFragment.restSize())
                return;
        }
    }
    _setUnConsumeDmkIn() {
        if (!this._unComsumed.restSize())
            return;
        let fulledLayerMap = new Map();
        let sortedLayerList = this.getSortedLayerList(), layerIdx = 0, layer = sortedLayerList[layerIdx];
        while (true) {
            let dmkData = this._unComsumed.get();
            dmkData.isUnConsume = true;
            if (dmkData.layer && this.layerMap.has(dmkData.layer) && !fulledLayerMap.get(this.layerMap.get(dmkData.layer))) {
                let layer = this.layerMap.get(dmkData.layer);
                if (!layer.setDanmukeIn(dmkData, this)) {
                    fulledLayerMap.set(layer, true);
                }
                else {
                    this._unComsumed.next();
                }
            }
            else {
                if (!layer.setDanmukeIn(dmkData, this)) {
                    fulledLayerMap.set(layer, true);
                    layer = sortedLayerList[++layerIdx];
                }
                else {
                    this._unComsumed.next();
                }
            }
            if (fulledLayerMap.size === this.layerMap.size || !this._unComsumed.restSize())
                return;
        }
    }
    _nextFrame() {
        if (this._frameHooks.beforeFrame)
            this._frameHooks.beforeFrame(this);
        if (this._frameRecord >= 60) {
            DmkUtil.forEachDelete(this._dmkFrames, frame => frame.isDead());
        }
        this._dmkFrames.forEach(frame => !frame.isDead() && frame.nextFrame(this));
        if (this._frameHooks.afterFrame)
            this._frameHooks.afterFrame(this);
    }
    reset() {
        this._dmkFrames = [];
        this._layerList.forEach(layer => layer.genTracks(this));
    }
    setFrameHooks(key, hookFn) {
        this._frameHooks[key] = hookFn;
    }
    deleteDmk(id) {
        this._dmkFragments.find(fragment => fragment.delete(id));
    }
    addFrame(frame) {
        this._dmkFrames.push(frame);
    }
    addLayer(layer, layerName) {
        this.layerMap.set(layerName, layer);
        this._normalizeLayerOpt(layer);
        layer.genTracks(this);
        this._layerList = null;
    }
    getSortedLayerList() {
        if (this._layerList) {
            return this._layerList;
        }
        this._layerList = [];
        this.layerMap.forEach(layer => this._layerList.push(layer));
        this._layerList.sort((layer1, layer2) => layer1.getOption('priority') - layer2.getOption('priority'));
        return this._layerList;
    }
    addDmkList(danmukeList) {
        danmukeList.forEach(dmk => {
            dmk.size = DmkUtil.measureSize(dmk.content, this.opt.fontSize || 25, this.opt.lineHeight || 30);
            let idx = DmkUtil.getFragmIdx(dmk.timestamp, this.opt.range);
            let fragment = this._dmkFragments[idx] || (this._dmkFragments[idx] = new DmkFragment());
            fragment.push(Object.assign({}, dmk));
        });
    }
    stop() {
        this._timeFrozen && this._timeFrozen();
    }
    start() {
        this.stop();
        let stop = false;
        this._timeFrozen = function () { stop = true; };
        let recursiveFrame = () => {
            if (window.hasSeek) {
                debugger;
            }
            requestAnimationFrame(() => {
                this._setDanmukeIn();
                this._setUnConsumeDmkIn();
                this._nextFrame();
                if (!stop) {
                    recursiveFrame();
                }
            });
        };
        recursiveFrame();
    }
}
