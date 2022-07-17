interface IPursuitItem {
  position: number;
  speed: number;
}

export class DmkUtil {
  static getFragmIdx(timestamp: number, range: number): number {
    return Math.floor(timestamp / range)
  }

  static isDef(value: any) {
    return value !== null && value !== undefined;
  }

  static ifCanCatchUp(item1: IPursuitItem, item2: IPursuitItem, ditance: number) {
    let time = Math.ceil((ditance - item2.position) / item2.speed);
    let awayFrom = item2.position - item1.position;
    return awayFrom / (item1.speed - item2.speed) < time;
  }

  static forEachDelete(arr: Array<any>, iterator: Function) {
    let index = 0;
    while(index < arr.length) {
      if (iterator(arr[index])) {
        arr.slice(index, 1);
      } else {
        index ++;
      }
    }
  }

  static sizeMesurer = null;

  static _timeoutRef = null;

  static measureSize(content: string, fontSize?: number, lineHeight?: number) {
    if (DmkUtil._timeoutRef) clearTimeout(DmkUtil._timeoutRef);
    DmkUtil._timeoutRef = setTimeout(() => {
      if (DmkUtil.sizeMesurer) {
        document.body.removeChild(DmkUtil.sizeMesurer);
        DmkUtil.sizeMesurer = null;
        DmkUtil._timeoutRef = null;
      }
    })
    if (!DmkUtil.sizeMesurer) {
      let msr = DmkUtil.sizeMesurer = document.createElement('div');
      msr.className = "text-len-measurer";
      msr.style.position = 'absolute';
      msr.style.opacity = '0';
      document.body.appendChild(msr);
    }
    fontSize && (DmkUtil.sizeMesurer.style.fontSize = fontSize + 'px');
    lineHeight && (DmkUtil.sizeMesurer.style.lineHeight = lineHeight + 'px');
    DmkUtil.sizeMesurer.innerText = content;
   
    return {
      width: DmkUtil.sizeMesurer.offsetWidth + 10,
      height: DmkUtil.sizeMesurer.offsetHeight
    }
  }

  static countSpeed() {

  }
}