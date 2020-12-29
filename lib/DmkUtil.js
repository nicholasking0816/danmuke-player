export class DmkUtil {
    static getFragmIdx(timestamp, range) {
        return Math.floor(timestamp / range);
    }
    static isDef(value) {
        return value !== null && value !== undefined;
    }
    static ifCanCatchUp(item1, item2, ditance) {
        let time = Math.ceil((ditance - item2.position) / item2.speed);
        let awayFrom = item2.position - item1.position;
        return awayFrom / (item1.speed - item2.speed) < time;
    }
    static forEachDelete(arr, iterator) {
        let index = 0;
        while (index < arr.length) {
            if (iterator(arr[index])) {
                arr.slice(index, 1);
            }
            else {
                index++;
            }
        }
    }
    static measureSize(content, fontSize, lineHeight) {
        if (!DmkUtil.sizeMesurer) {
            let msr = DmkUtil.sizeMesurer = document.createElement('div');
            msr.className = "text-len-measurer";
            document.body.appendChild(msr);
        }
        fontSize && (DmkUtil.sizeMesurer.style.fontSize = fontSize + 'px');
        lineHeight && (DmkUtil.sizeMesurer.style.lineHeight = lineHeight + 'px');
        DmkUtil.sizeMesurer.innerText = content;
        return {
            width: DmkUtil.sizeMesurer.offsetWidth + 10,
            height: DmkUtil.sizeMesurer.offsetHeight
        };
    }
    static countSpeed() {
    }
}
DmkUtil.sizeMesurer = null;
