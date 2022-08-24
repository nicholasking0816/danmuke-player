export interface IVideo {
  width: number;
  height: number;
  container?: HTMLElement,
  videoInstance: any;
  currentTime: number;
}