import { Danmuke } from "../../Danmuke";
import { DmkCtrl } from "../../DmkCtrl";
import { AdvanceDanmukeDesc, AnimationDesc, AnimationType } from "./AdvanceDanmukeUtil";
import { AdvanceDmkTrack } from "./AdvanceDmkTrack";
import { AnimationPlayer } from "./AnimationPlayer";
import { OpacityAnimation } from "./OpacityPlayer";
import { RoatePlayer } from "./RotatePlayer";
import { ScalePlayer } from "./ScalePlayer";
import { TranslatePlayer } from "./TransplatePlayer";

export class AdvanceDanmuke extends Danmuke {
    private _duration: number;
    private _playTime: number;
    private _transformStr: string;
    private _palyerList: AnimationPlayer[] = [];
    
    constructor(dmkDesc: AdvanceDanmukeDesc, track: AdvanceDmkTrack, ctrl: DmkCtrl) {
        super(dmkDesc, track, ctrl)
        this._duration = dmkDesc.duration;
        this._playTime = dmkDesc.timestamp;
        this._transformStr = dmkDesc.transformStr;
        let animation = dmkDesc.animation;
        this.styles = dmkDesc.style || {};
        if (Array.isArray(animation)) {
            animation.forEach(anm => {
                switch(anm.type) {
                    case AnimationType.Translate:
                        this._palyerList.push(new TranslatePlayer(anm));
                        break;
                    case AnimationType.Rotate:
                        this._palyerList.push(new RoatePlayer(anm));
                        break
                    case AnimationType.Opacity:
                        this._palyerList.push(new OpacityAnimation(anm));
                        break
                    case AnimationType.Scale:
                        this._palyerList.push(new ScalePlayer(anm))           
                }
            })
        }
    }

    static mergeStyle(originStyle, currentStyle) {
        let newStyle: any = {...originStyle};
        for(let key in currentStyle) {
            let originValue = originStyle[key];
            let currentValue = currentStyle[key];
            if (typeof currentValue === 'object') {
                if (!originValue || typeof originValue !== 'object') {
                    newStyle[key] = currentValue
                } else {
                    newStyle[key] = AdvanceDanmuke.mergeStyle(originValue, currentValue)
                }
            } else {
                newStyle[key] = currentValue
            }
        }
        return newStyle;
    }

    updateStyle(style) {
        let transform  = style.transform, transformStr = this._transformStr || ''; 
        if( transform ) {
            if (typeof transform === 'string') {
                transformStr = transform;
            }
            if (transform.translate) {
                let translate = transform.translate;
                transformStr += ` translate3D(${translate.left}, ${translate.top}, 0)`
            }
            if (transform.rotate) {
                transformStr += ` rotate3D(0,0,1,${transform.rotate})`
            }
            if (transform.scale) {
                let scale = transform.scale;
                transformStr += ` scale(${scale}, ${scale})`
            }
        }
        this.styles = {...style, transform: transformStr}
    }

    nextFrame(ctr: DmkCtrl) {
        let style: any = this.styles, index = 0;
        debugger;
        while(index < this._palyerList.length) {
            let palyer: AnimationPlayer = this._palyerList[index];
            if (!palyer.canPlay()) {
                index ++;
                continue
            };
            style = AdvanceDanmuke.mergeStyle(style, palyer.play());
            if (palyer.isComplete()) {
                this._palyerList.splice(index, 1);
                continue;
            }
            index ++;
        }
        this.updateStyle(style);
        if (ctr.video.videoInstance.currentTime - this._playTime >= this._duration) {
            this.dead()
        }
    }
}

