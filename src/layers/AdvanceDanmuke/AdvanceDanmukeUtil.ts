export interface AdvanceDanmukeDesc {
    style: any;
    layer: string;
    content: string;
    timestamp: number; // 弹幕在视频中的什么时间点开始播放, 以秒为单位
    duration: number; // 弹幕存活时间，以秒为单位
    animation: AnimationDesc[];
    transformStr?: string;

}

export interface AnimationDesc {
    type: AnimationType;
    from: any;
    to: any;
    xA?: number; // 加速度，单位px
    yA?: number;
    rA?: number;
    sA?: number;
    duration: number;
    delay: number; // 延迟播放时间， 以毫秒为单位
}

export enum AnimationType {
    Translate = 'Translate', // 位移
    Rotate = 'Rotate', // 旋转
    Opacity = 'Opacity', // 渐变显示和渐变消失
    Scale = 'scale', // 缩放
}
