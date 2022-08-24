import { Danmuke } from "./Danmuke";
import { DmkCtrl } from "./DmkCtrl";
import { DmkLayer } from "./DmkLayer";
import { IDmkData } from "./interface/IDmkDate.interface";
import { IDmkOpt } from "./interface/IDmkOpt.interface";
import { IVideo } from "./interface/IVideo.interface";

export class DanmukePlayer {
    private _dmkCtrl: DmkCtrl;
    private _container: HTMLElement;
    private _dmkViewNodeMap: Map<Danmuke, HTMLElement> = new Map();

    constructor(video: IVideo, opt?: IDmkOpt, dmkList?: IDmkData[]) {
        this._dmkCtrl = new DmkCtrl(dmkList || [], opt || {}, video);
        this._container = video.container || video.videoInstance.parentNode;
        this._dmkCtrl.setHooks('afterFrame', () => {
            this.dataToView();
            this.clean();
        })
        
    }

    dataToView() {
        let fragment = document.createDocumentFragment()
        this._dmkCtrl.getSortedLayerList().forEach((layer: DmkLayer, index: number) => {
            const danmkes = layer.getAllDmk();
            danmkes.forEach((danmuke: Danmuke) => {
                let dmkNode: HTMLElement = this._dmkViewNodeMap.get(danmuke);
                danmuke.styles.zIndex = 100 + index;
                if (dmkNode) {
                    Object.assign(dmkNode.style, danmuke.styles);
                } else {
                    dmkNode = document.createElement('div');
                    dmkNode.className = 'danmuke-node';
                    dmkNode.innerText = danmuke.content;
                    Object.assign(dmkNode.style, danmuke.styles);
                    this._dmkViewNodeMap.set(danmuke, dmkNode);
                    fragment.appendChild(dmkNode);
                }
            })
        })
        this._container.appendChild(fragment);
    }

    clean() {
        const keys: Iterable<Danmuke> = this._dmkViewNodeMap.keys();
        for(let danmuke of keys) {
            if (danmuke.isDead()) {
                const node: HTMLElement = this._dmkViewNodeMap.get(danmuke);
                this._container.removeChild(node);
                this._dmkViewNodeMap.delete(danmuke);
            }
        }
    }

    cleanAll() {
        this._dmkViewNodeMap.forEach(node => {
            this._container.removeChild(node);
        })
        this._dmkViewNodeMap.clear();
    }

    addDmkLayer(layer: DmkLayer, name: string) {
        this._dmkCtrl.addLayer(layer, name);
    }

    start() {
        this._dmkCtrl.start();
    }

    stop() {
        this._dmkCtrl.stop();
    }

    getCtrl() {
        return this._dmkCtrl;
    }

    reset() {
        this._dmkCtrl.reset();
        this.cleanAll();
    }

    setHooks(key: string, hookFn: Function) {
        this._dmkCtrl.setHooks(key, hookFn);
    }

    deleteDmk(id) {
        this._dmkCtrl.deleteDmk(id);
    }

    getActiveDmks() {
        this._dmkCtrl.getActiveDmks();
    }

    getSortedLayerList() {
        this._dmkCtrl.getSortedLayerList();
    }

    addDmkList(danmukeList: any[]) {
        this._dmkCtrl.addDmkList(danmukeList);
    }
}