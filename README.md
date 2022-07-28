# 快速开始
```bash
npm install --save danmuke-player
```

### index.html

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        #app {
            width: 1000px;
            height: 562px;
            overflow: hidden;
            margin: 0 auto;
            position: relative;
        }
        #video {
            width: 100%;
            height: 100%;
        }
    </style>
    <title>Document</title>
</head>
<body>
    <div id="app">
        <video id="video" src="najimi.mp4"  controls="true"></video>
    </div>
</body>
</html>
```

### index.js

```javascript
import { DanmukePlayer } from 'danmuke-player';
import {v4 as uuidV4} from 'uuid';

const video = document.querySelector('#video');

function gDanmukes() { // 随机生成弹幕
    const danmukeList: any[] = [] as any;
    for(let i = 0; i < 100; i ++) {
        danmukeList.push({
            content: '夏目小天使yyds', // 弹幕内容
            id: uuidV4(), // 弹幕唯一标识
            timestamp: Math.floor(100 * Math.random()), // 弹幕在视频的什么时间点播放, 以秒为单位
            
        })
    }
    return danmukeList;
}

const player = new DanmukePlayer({
    width: 1000, // 视频的宽度
    height: 562, // 视频的高度
    videoInstance: video // video元素实例
}, {
    range: 1; // 用于弹幕分组的时间间隔，以秒为单位
    fontSize: 25; // 弹幕font-size
    trackHeight: 30; // 弹幕轨道高度
    lineHeight: 30; // 弹幕line-height
    baseSpeed: 1; // 弹幕播放速度
});

player.addDmkList(gDanmukes()) // 添加弹幕

video.onplay = () => {
    player.start();
}
video.onpause = () => {
    player.stop();
}

```


# DanmukePlayer API

### danmukePlayer.start()

    播放弹幕

### danmukePlayer.stop()

    停止播放弹幕

### danmukePlayer.reset()

    弹幕清屏

### danmukePlayer.dataToView()

    生成弹幕节点

### danmukePlayer.clean()

    清除弹幕状态为deaded 的弹幕对应的dom节点

### danmukePlayer.cleanAll()
    清除所有弹幕

### danmukePlayer.addDmkLayer(layer: DmkLayer, name: string)

    添加自定义弹幕层

#### 参数
    layer: 弹幕层实例
    name: 弹幕层名称

### danmukePlayer.setHooks(key: string, hookFn: Function)
    
    添加钩子函数
    
```javascript
danmukePlayer.setHooks('beforeFrame', function(ctrl: DmkCtrl) { // beforeFrame 在弹幕下一帧播放前执行
    console.log('beforeFrame ...')
})

danmukePlayer.setHooks('afterFrame', function(ctrl: DmkCtrl) { // afterFrame 在弹幕下一帧播放后执行
    console.log('afterFrame ...')
})
```

### danmukePlayer.deleteDmk(id: string)

    根据弹幕id删除弹幕

### danmukePlayer.getActiveDmks()
    
    获取所有正在播放中的弹幕

### danmukePlayer.getSortedLayerList()
    
    返回包含所有弹幕层的数组，数组里的弹幕层已按弹幕层的priority排好序

### danmukePlayer.addDmkList(danmukeList) 
    
    添加弹幕数据

# 添加自定义高级弹幕层

弹幕默认的播放方式和大多数视频网站一样是从右到左的横向平移, 但有时候我们想要让弹幕有不一样的播放方式(例如bilibili的高级弹幕功能), 
这时候我们可以通过添加自定义弹幕层实现

在以下例子我们实现一个弹幕层，该弹幕层里的弹幕会从视频左上角进场， 然后以随机方向和速度作散射状运动
### ./src/index.js
    
```javascript
import { DanmukePlayer } from 'danmuke-player';
import { AdvanceDmkTrack } from './AdvanceDmkTrack';
import {v4 as uuidV4} from 'uuid';

const video = document.querySelector('#video');

function gDanmukes() { // 随机生成弹幕
    const danmukeList: any[] = [] as any;
    for(let i = 0; i < 100; i ++) {
        danmukeList.push({
            content: this.advanceDanmukeRef.current.value,
                id: uuidV4(),
                layer: 'AdvanceLayer',
                timestamp: Math.floor(100 * Math.random()),
                color: 'red',
                fontSize: 18,
                animation: {
                    translate: {
                        from: {
                            left: 0,
                            top: 0
                        },
                        to: {
                            left: Math.floor(1000 * Math.random()),
                            top: Math.floor(500 * Math.random())
                        },

                    }
                } 
            
        })
    }
    return danmukeList;
}

const player = new DanmukePlayer({
    width: 1000, // 视频的宽度
    height: 562, // 视频的高度
    videoInstance: video // video元素实例
}, {
    range: 1; // 用于弹幕分组的时间间隔，以秒为单位
    fontSize: 25; // 弹幕font-size
    trackHeight: 30; // 弹幕轨道高度
    lineHeight: 30; // 弹幕line-height
    baseSpeed: 1; // 弹幕播放速度
});

player.addDmkList(gDanmukes()) // 添加弹幕

// 添加自定义弹幕层实例, 弹幕层构造函数的第一个参数位自定义的弹幕轨道
this.player.addDmkLayer(new DmkLayer(AdvanceDmkTrack, {
    priority: 3, // 弹幕层的优先级, 当前弹幕层容纳不下的弹幕会流向priority更低的弹幕层
    trackCount: 1 // 弹幕层里可容纳的弹幕轨道的最大数，若没有配置该参数，轨道数会根据视频高度和轨道高度自定计算
}), 'AdvanceLayer'/*弹幕层名称*/)

video.onplay = () => {
    player.start();
}
video.onpause = () => {
    player.stop();
}
```

### ./src/AdvanceDmkTrack.js

```javascript
import { DmkTrack } from 'danmuke-player';

export class AdvanceDmkTrack extends DmkTrack {
    constructor(level) {
        super(level)
    }

    init(dmkLayer, ctr) {

    }
    
    // 根据传入的弹幕数据生成相应的弹幕对象并将其return
    getDmkInstance(dmkData, ctr) { 
        return new AdvanceDanmuke(dmkData, this, ctr);
    }
    
    /* *****************************************************

        判断弹幕是否可以进场, 在每一个时间循环中会依次把到了
    播放时间点的弹幕依次作为参数调用该方法。如果该方法返回true，
    则会把相应的弹幕数据作为参数调用getDmkInstance方法，并把该
    方法返回的弹幕对象push到dmkQueue列表中

    ***********************************************************/
    isCanIn(dmkData, ctr) { 
        return true;
    }
    
    // 判断弹幕是否可以离场, 离场的弹幕相应的dom节点会被销毁, 相应的弹幕对象也会在dmkQueue列表中删除
    isCanOut(dmk) { 
        return dmk.isDead();
    }
}

```

### ./src/AdvanceDanmuke.js

```javascript
import { Danmuke } from 'danmuke-player';

export class AdvanceDanmuke extends Danmuke {    
    constructor(dmkData, track, ctrl) {
        super(dmkData, track, ctrl)
        this._curLeft = 0;
        this.__curTop = 0;
        this.isCanPlay = false;
        const animation = dmkData.animation;
        if (animation.translate) {
            const from = animation.translate.from;
            const to = animation.translate.to;
            const duration = (animation.translate.duration || 5) * 60;
            const left = from.left;
            const top = from.top;
            this._hDistance = to.left - left;
            this._vDistance = to.top - top;
            this._hStep = this._hDistance / duration;
            this._vStep = this._vDistance / duration;

            // this.styles里的值会被赋给弹幕对应的dom节点的style上
            this.styles = {
                position: 'absolute',
                left: left + 'px',
                top: top + 'px',
                fontSize: '18px',
                zIndex: 103,
                color: dmkData.color || 'red'
            }
        }
        
    }

    getCurPos() {
        return {
            left: this._curLeft,
            top: this._curTop
        }
    }

    /*****************************************************
        每一个弹幕对象都必须实现该方法，在每一个事件件循环中
    在弹幕轨道的dmhQueue列表里的弹幕对象都会调用该方法, 通过
    在该方法中代码更改 弹幕dom节点的style属性即可实现复杂的弹
    幕动画
   **************************************************************/
    nextFrame(ctr) {
        this._curLeft += this._hStep;
        this._curTop += this._vStep;
        this.styles.transform = `translate3D(${this._curLeft}px, ${this._curTop}px, 0)`;
        if (Math.abs(this._curLeft) >= Math.abs(this._hDistance) || Math.abs(this._curTop) >= Math.abs(this._vDistance)) {
            this.dead();
        }
    }
}
```

danmuke-player 内置了默认的弹幕层, 其弹幕的播放方式为从右到左的的横向移动, 下面式其源码地址

[https://github.com/nicholasking0816/danmuke-player/blob/main/src/AnmDmkTrack.ts](https://github.com/nicholasking0816/danmuke-player/blob/main/src/AnmDmkTrack.ts)
[https://github.com/nicholasking0816/danmuke-player/blob/main/src/AnmDanmuke.ts](https://github.com/nicholasking0816/danmuke-player/blob/main/src/AnmDanmuke.ts)


### demo 地址

[https://github.com/nicholasking0816/danmuke-player-demo](https://github.com/nicholasking0816/danmuke-player-demo)

## 如有问题，请邮件联系!! 邮箱：nicholasking0816@163.com
