export interface IDmkData {
  content: string; // 弹幕内容
  timestamp: number; // 弹幕在视频的什么时间点播放，以秒为单位
  id: string; // 弹幕的唯一标识
  layer?: any; // 弹幕属于的弹幕层名称
  isUnConsume?: boolean;
  size?: any;
}