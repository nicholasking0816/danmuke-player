import { DefaultDmkCtrOpt } from './constantData';
import { IVideo } from './interface/IVideo.interface';
import { IDmkFrame } from './interface/IDmkFrame.interface';
import { DmkFragment } from './DmkFragment';
import { DmkUtil } from './DmkUtil';
import { IDmkData } from './interface/IDmkDate.interface';
import { IDmkOpt } from './interface/IDmkOpt.interface';
import { DmkLayer } from './DmkLayer';
import { AnmDmkTrack } from './AnmDmkTrack';
import { StaticDmkTrack } from './StaticDmkTrack';
import { Danmuke } from './Danmuke';
import { DmkTrack } from './DmkTrack';
export class DmkCtrl {
  private _timeFrozen: Function;
  private _frameRecord = 0;
  private _unComsumed: DmkFragment = new DmkFragment();
  private _frameHooks: any = {};
  private _dmkFragments: any = {};
  private _currentIdx: number;
  private _currentFragment: DmkFragment;
  private _layerList: Array<DmkLayer>;

  layerMap: Map<string, DmkLayer> = new Map();
  
  constructor(danmukeList: Array<IDmkData>, public opt: IDmkOpt, public video: IVideo) {
    this._init(danmukeList);
  }

  private _normalizeLayerOpt(layer: DmkLayer) {
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

  private _initOpt() {
    this.opt = Object.assign({}, DefaultDmkCtrOpt, this.opt);
  }

  private _init(danmukeList: Array<IDmkData>) {
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

  private _setDanmukeIn() {
    let fulledLayerMap: Map<DmkLayer, boolean> = new Map();
    this._currentIdx = DmkUtil.getFragmIdx(this.video.videoInstance.currentTime, this.opt.range);
    let currentFragment: DmkFragment = this._dmkFragments[this._currentIdx];
    if (this._currentFragment && this._currentFragment !== currentFragment) {
      this._unComsumed.push(...this._currentFragment.flush());
    }
    this._currentFragment = currentFragment;
    if (!this._currentFragment || !this._currentFragment.restSize()) return;
    if (!this._currentFragment.isSorted) this._currentFragment.sort();
    let sortedLayerList = this.getSortedLayerList(), layerIdx = 0, layer = sortedLayerList[layerIdx];

    while(true) {
      let dmkData: IDmkData = this._currentFragment.get();
      if (dmkData.layer && this.layerMap.has(dmkData.layer) && !fulledLayerMap.get(this.layerMap.get(dmkData.layer))) {
        let layer = this.layerMap.get(dmkData.layer);
        if (!layer.setDanmukeIn(dmkData, this)) {
          fulledLayerMap.set(layer, true);
        } else {
          this._currentFragment.next();
        }
      } else {
        if (!layer.setDanmukeIn(dmkData, this)) {
          fulledLayerMap.set(layer, true);
          layer = sortedLayerList[++layerIdx];
        } else {
          this._currentFragment.next();
        }
      }
      if(fulledLayerMap.size === this.layerMap.size || !this._currentFragment.restSize()) return;
    }
  }

  private _setUnConsumeDmkIn() {
    if (!this._unComsumed.restSize()) return;
    let fulledLayerMap: Map<DmkLayer, boolean> = new Map();
    let sortedLayerList = this.getSortedLayerList(), layerIdx = 0, layer = sortedLayerList[layerIdx]
    while(true) {
      let dmkData: IDmkData = this._unComsumed.get();
      dmkData.isUnConsume = true;
      if (dmkData.layer && this.layerMap.has(dmkData.layer) && !fulledLayerMap.get(this.layerMap.get(dmkData.layer))) {
        let layer = this.layerMap.get(dmkData.layer);
        if (!layer.setDanmukeIn(dmkData, this)) {
          fulledLayerMap.set(layer, true);
        } else {
          this._unComsumed.next();
        }
      } else {
        if (!layer.setDanmukeIn(dmkData, this)) {
          fulledLayerMap.set(layer, true);
          layer = sortedLayerList[++layerIdx];
        } else {
          this._unComsumed.next();
        }
      }
      if(fulledLayerMap.size === this.layerMap.size || !this._unComsumed.restSize()) return;
    }
  }

  private _nextFrame() {
    if (this._frameHooks.beforeFrame) this._frameHooks.beforeFrame(this);
    this.getSortedLayerList().forEach((layer: DmkLayer) => {
      layer.trackList.forEach((track: DmkTrack) => {
        track.nextFrame();
        track.getDmkQueue().forEach((dmk: Danmuke) => dmk.nextFrame(this))
      })
    })
    if (this._frameHooks.afterFrame) this._frameHooks.afterFrame(this);
  }

  reset() {
    this._layerList.forEach(layer => layer.genTracks(this))
  }

  setHooks(key: string, hookFn: Function) {
    this._frameHooks[key] = hookFn;
  }

  deleteDmk(id: string) {
    for(let key in this._dmkFragments) {
      if (this._dmkFragments[key].delete(id)) return
    }
  }

  getActiveDmks() {
    return this.getSortedLayerList().reduce((result: Danmuke[], layer: DmkLayer) => {
      return result.concat(layer.getAllDmk())
    }, [] as any)
  }

  addLayer(layer: DmkLayer, layerName: string) {
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
    this._layerList.sort((layer1, layer2) => layer1.getOption('priority') - layer2.getOption('priority') );
    return this._layerList;
  }

  addDmkList(danmukeList: Array<any>) {
    danmukeList.forEach(dmk => {
      dmk.size = DmkUtil.measureSize(dmk.content, dmk.fontSize || this.opt.fontSize || 25, dmk.lineHeight || this.opt.lineHeight || 30);
      let idx = DmkUtil.getFragmIdx(dmk.timestamp, this.opt.range);
      let fragment: DmkFragment = this._dmkFragments[idx] || (this._dmkFragments[idx] = new DmkFragment());
      fragment.push(Object.assign({}, dmk));
    });
  }

  stop() {
    this._timeFrozen && this._timeFrozen();
  }

  start() {
    this.stop();
    let stop = false;
    this._timeFrozen = function() { stop = true };
    let recursiveFrame = () => {
      requestAnimationFrame(() => {
        this._setDanmukeIn();
        this._setUnConsumeDmkIn();
        this._nextFrame();
        if (!stop) {
          recursiveFrame()
        }
      })
    };
    recursiveFrame();
  }
}