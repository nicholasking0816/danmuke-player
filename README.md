

# demo 地址

[http://47.104.67.88:3000/dist/](http://47.104.67.88:3000/dist/)

# demo源码 地址

[https://github.com/nicholasking0816/danmuke-player-demo](https://github.com/nicholasking0816/danmuke-player-demo)

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

# 添加自定义弹幕层

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

# 启动高级弹幕层

danmuke-player 内置了默认的弹幕层, 其弹幕的播放方式为从右到左的的横向移动, 如果想要设置更灵活的弹幕动画，请参照下面代码启动高级弹幕层。

```javascript
import { AdvanceDmkTrack, DanmukePlayer, DmkLayer } from 'danmuk-player';

const player = new DanmukePlayer({
    width: 1000,
    height: 562,
    videoInstance: video /*vedio标签实例*/,
    currentTime: 0,
} as any, {}, []);

// 添加高级弹幕层
player.addDmkLayer(new DmkLayer(AdvanceDmkTrack, {
    priority: 3,
    trackCount: 1
}), 'AdvanceLayer')

// 添加高级弹幕数据
const currentTime = video.currentTime;
player.addDmkList(getDmkDesc(currentTime));
player.addDmkList(getDmkDesc2(currentTime));
player.addDmkList(getDmkDesc3(currentTime));
player.addDmkList(getDmkDesc4(currentTime));
player.addDmkList(getDmkDesc5(currentTime));
player.addDmkList(getDmkDesc6(currentTime));

function getDmkDesc(currentTime) {
    let posList = [-90,60,300,100,70,-140,300,300,-70,60,600,100,90,-140,600,300]
    return ['高', '级', '弹', '幕'].map((content, index) => {
        let start = 4 * index;
        return {
            timestamp: currentTime, // 弹幕在视频中开始播放的时间，单位为妙
            layer: 'AdvanceLayer', // 该弹幕要在什么弹幕层中播放
            content: content, // 弹幕文本内容
            duration: 6, // 弹幕存活时间
            animation: [ // 弹幕动画列表
                {
                    type: 'Translate', // 动画类型为平移
                    delay: 3.5, // 该动画在延迟3.5秒后开始播放
                    duration: 0.5, // 该平移动作将在0.5秒内完成
                    from: {
                        left: 0,
                        top: 0
                    },
                    to: {
                        left: posList[start + 0],
                        top: posList[start + 1]
                    }
                },
                {
                    type: 'Opacity', // 动画类型为透明度的改变，即淡入淡出
                    delay: 1 + 0.5 * index,
                    duration: 0, // 完成该动作用时0秒即该弹幕会从隐身状态到一下子出现
                    from: {
                        opacity: 0
                    },
                    to: {
                        opacity: 1
                    }
                }
            ],
            style: { // 弹幕的一些初始样式
                fontSize: '60px',
                position: 'absolute', // 弹幕的position最好一直是absolute
                left: `${posList[start + 2]}px`,
                top: `${posList[start + 3]}px`,
                opacity: 0,
                color: 'red',
            }
        }
    })
}

function getDmkDesc2(currentTime) {
    let descList = [];
    for(let index = 0; index < 15; index ++) {
        let delay = 0 + 0.5 * index;
        descList.push(
            {
                timestamp: currentTime + 6,
                layer: 'AdvanceLayer',
                content: '我是平移的高级弹幕',
                duration: 10,
                animation: [
                    {
                        type: 'Translate',
                        delay: delay,
                        duration: 1.5,
                        from: {
                            left: 0,
                            top: 0
                        },
                        to: {
                            left: 1000,
                            top: 0
                        }
                    },
                    {
                        type: 'Translate',
                        delay: 1.5 + delay,
                        duration: 1.5,
                        from: {
                            left: 1000,
                            top: 0
                        },
                        to: {
                            left: 270,
                            top: 0
                        }
                    },
                ],
                style: {
                    fontSize: '30px',
                    lineHeight: '30px',
                    position: 'absolute',
                    left: '-270px',
                    top: `${40 * index}px`,
                    color: 'red',
                }
            }
        )
    }
    return descList;
}

function getDmkDesc3(currentTime) {
    let descList = [];
    for(let i = 0; i < 12; i ++) {
        descList.push({
            timestamp: currentTime + 15,
            layer: 'AdvanceLayer',
            content: '我是旋转的高级弹幕',
            duration: 3.5,
            animation: [ // 该弹幕会一边旋转一边淡入
                {
                    type: 'Rotate',
                    delay: 1,
                    duration: 1.5,
                    from: {
                        deg: 0
                    },
                    to: {
                        deg: 30 * i
                    }
                },
                {
                    type: 'Opacity',
                    delay: 1,
                    duration: 1.5,
                    from: {
                        opacity: 0
                    },
                    to: {
                        opacity: 1
                    }
                },
            ],
            style: {
                fontSize: '20px',
                width: '240px',
                transformOrigin: '100% 50% 0',
                lineHeight: '20px',
                position: 'absolute',
                left: '270px',
                top: `271px`,
                opacity: 0,
                color: 'red',
            }
        })
    }
    return descList;
}

function getDmkDesc4(currentTime) {
    let delay = 0, descList = [];
    [
        [
            '人生自古谁无死',
            '留取丹心照汗青'
        ],
        [
            '醒后不知天在水',
            '满船清梦压星河'
        ],
        [
            '六宫粉黛无颜色',
            '回眸一笑百媚生'
        ]
    ].forEach((verse, index) => {
        let pos = [100 + index * 100, 100];
        verse.forEach((line, index) => {
            for(let i = 0, len = line.length; i < len; i++) {
                delay += 0.3;
                descList.push({
                    timestamp: currentTime + 18,
                    layer: 'AdvanceLayer',
                    content: line.charAt(i),
                    duration: 14,
                    animation: [
                        {
                            type: 'Opacity',
                            delay: delay,
                            duration: 1,
                            from: {
                                opacity: 0
                            },
                            to: {
                                opacity: 1
                            }
                        },
                    ],
                    style: {
                        fontSize: '20px',
                        lineHeight: '20px',
                        position: 'absolute',
                        left: `${pos[0] + 30 * index}px`,
                        top: `${pos[1] + 25 * i}px`,
                        opacity: 0,
                        color: 'red',
                    }
                })
            }
        })
    })
    return descList;
}

function getDmkDesc5(currentTime) {
    let contents = [
        '刘亦菲是我老婆',
        '迪丽热巴yyds',
        'javascript是世界上最好的语言',
        '赵丽颖是我前任',
        '赵露思是我初恋'
    ], descList = [];
    for(let i = 1; i < 30; i ++) {
        let delay = 0.3 * i, 
            distance = 100 + Math.round(100 * Math.random()),
            left = Math.round(distance * Math.random()), 
            directionX = Math.random() > 0.5 ? 1 : -1, 
            directionY = Math.random() > 0.5 ? 1 : -1,
            zIndex = 200;
        descList.push({
            timestamp: currentTime + 32,
            layer: 'AdvanceLayer',
            content: contents[Math.round(4 * Math.random())],
            duration: delay + 2,
            animation: [
                {
                    type: 'Translate',
                    delay: delay,
                    duration: 2,
                    from: {
                        left: 0,
                        top: 0
                    },
                    to: {
                        left: left * directionX,
                        top: Math.sqrt(distance ** 2 - left ** 2) * directionY
                    }
                },
                {
                    type: 'Opacity',
                    delay: delay,
                    duration: 2,
                    from: {
                        opacity: 0
                    },
                    to: {
                        opacity: 1
                    }
                },
                {
                    type: 'Scale',
                    delay: delay,
                    duration: 2,
                    from: {
                        scale: 0.2
                    },
                    to: {
                        scale: 1
                    }
                },
            ],
            style: {
                fontSize: '20px',
                lineHeight: '20px',
                position: 'absolute',
                left: `300px`,
                transformOrigin: '50% 50% 0',
                top: `300px`,
                transform: 'scale(0.2,0.2)',
                opacity: 0,
                color: 'red',
                zIndex: zIndex - i
            }
        })
    }
    return descList
}

function getDmkDesc6(currentTime) {
    return [
        '安史之乱是中国唐代玄宗末年至代宗初',
        '年(755年12月16日至763年2月17日)由',
        '唐朝将领安禄山与史思明背叛唐朝后发动',
        '的战争，是同唐朝争夺统治权的内战，为',
        '唐由盛而衰的转折点。这场内战使得唐朝',
        '人口大量丧失，国力锐减。因为发起反唐',
        '叛乱的指挥官以安禄山与史思明二人为主，',
        '因此事件被冠以安史之名。 [1]  又由于',
        '其爆发于唐玄宗天宝年间，也称天宝之乱。'
    ].map((content, index) => {
        let delay = index * 0.5;
        return {
            timestamp: currentTime + 43,
            layer: 'AdvanceLayer',
            content: content,
            duration: 30,
            animation: [
                {
                    type: 'Translate',
                    delay: delay,
                    duration: 5,
                    from: {
                        left: 0,
                        top: 0
                    },
                    to: {
                        left: 0,
                        top: -200
                    }
                },
                {
                    type: 'Opacity',
                    delay: delay,
                    duration: 5,
                    from: {
                        opacity: 1
                    },
                    to: {
                        opacity: 0
                    }
                },
                {
                    type: 'Opacity',
                    delay: delay,
                    duration: 0,
                    from: {
                        opacity: 0
                    },
                    to: {
                        opacity: 1
                    }
                },
                {
                    type: 'Scale',
                    delay: delay,
                    duration: 5,
                    from: {
                        scale: 1
                    },
                    to: {
                        scale: 0.3
                    }
                }
            ],
            style: {
                fontSize: '20px',
                lineHeight: '20px',
                position: 'absolute',
                left: `300px`,
                transformOrigin: '50% 50% 0',
                top: `500px`,
                opacity: 0,
                color: 'red',
            },
            transformStr: 'rotateX(60deg)', // 要添加初始初始的transform样式最好用这个属性，应为style.transfrom的值在播放动画时会被覆盖
        }
    })
}
```
### 高级弹幕数据支持的所有属性值如下
```javascript
export interface AdvanceDanmukeDesc {
    style: any; // 样式
    layer: string; // 该弹幕属于哪个弹幕层
    content: string; // 弹幕内容
    timestamp: number; // 弹幕在视频中的什么时间点开始播放, 以秒为单位
    duration: number; // 弹幕存活时间，以秒为单位
    animation: AnimationDesc[]; // 动画描述列表
    transformStr?: string; // 要添加初始初始的transform样式最好用这个属性，应为style.transfrom的值在播放动画时会被覆盖

}

export interface AnimationDesc {
    type: AnimationType; // 动画类型， 支持Translate，Rotate，Opacity，scale四种
    from: {left: number, top: number}/*平移*/ | {scale:number}/*缩放*/ | {deg:number}/*旋转*/ | {opacity: number}/*淡入淡出*/;
    to: {left: number, top: number}/*平移*/ | {scale:number}/*缩放*/ | {deg:number}/*旋转*/ | {opacity: number}/*淡入淡出*/;
    xA?: number; // 横向平移加速度，单位px
    yA?: number; // 纵向平移加速度, 单位px
    rA?: number; // 旋转加速度, 单位px
    sA?: number; // 缩放加速度, 单位px
    duration: number; // 完成动画所耗的时间, 可控制动画的速度
    delay: number; // 延迟播放时间， 以秒为单位
}
```

## 要看高级弹幕层的播放效果请点击文档开头的demo地址。


## 如有问题，请邮件联系!! 邮箱：nicholasking0816@163.com
