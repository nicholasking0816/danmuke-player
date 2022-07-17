import * as React from 'react';
import {v4 as uuidV4} from 'uuid';
import { DanmukePlayer } from '../src/DanmukePlayer';
import './App.scss';
import { DmkLayer } from '../src/DmkLayer';
import { AdvanceDmkTrack } from './AdvanceDmkTrack';

export class App extends React.Component<any, any, any> {
    videoRef: any = React.createRef();
    player: DanmukePlayer;
    normalDanmukeRef: any = React.createRef();
    advanceDanmukeRef: any = React.createRef();
    constructor(props) {
        super(props);
    }

    gDanmukes() {
        const danmukeList: any[] = [] as any;
        for(let i = 0; i < 100; i ++) {
            danmukeList.push({
                content: '夏目小天使yyds',
                id: uuidV4(),
                // layer: 'AdvanceLayer',
                timestamp: Math.floor(100 * Math.random()),
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

    sendNormalDanmuke() {
        this.player.addDmkList([
            {
                content: this.normalDanmukeRef.current.value,
                id: uuidV4(),
                timestamp: this.videoRef.current.currentTime + 1,
                color: 'red',
            }
        ])
    }

    sendAdvanceDanmuke() {
        this.player.addDmkList([
            {
                content: this.advanceDanmukeRef.current.value,
                id: uuidV4(),
                layer: 'AdvanceLayer',
                timestamp: this.videoRef.current.currentTime + 1,
                color: 'orange',
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
            }
        ])
    }

    componentDidMount() {
        this.player = new DanmukePlayer({
            width: 1000,
            height: 562,
            videoInstance: this.videoRef.current,
            currentTime: 0,
        }, {}, this.gDanmukes(),);
        this.player.addDmkLayer(new DmkLayer(AdvanceDmkTrack, {
            priority: 3,
            trackCount: 1
        }), 'AdvanceLayer')
        this.videoRef.current.onplay = () => {
            console.log('start ...')
            this.player.start();
        }
        this.videoRef.current.onpause = () => {
            this.player.stop();
        }
    }

    render() {
        return (
            <div className='danmuke-player-demo'>
                <div className='video-wrapper'>
                    <video src="najimi.mp4" ref={this.videoRef} controls={true}></video>
                </div>
                <div className='send-danmuke'>
                    <div className='normal-danmuke'>
                        <input type="text" ref={this.normalDanmukeRef} />
                        <button onClick={this.sendNormalDanmuke.bind(this)}>发送普通弹幕</button>
                    </div>
                    <div className='advance-danmuke'>
                        <input type="text" ref={this.advanceDanmukeRef} />
                        <button onClick={this.sendAdvanceDanmuke.bind(this)}>发送高级弹幕</button>
                    </div>
                </div>
            </div>  
            
        )
    }
}
