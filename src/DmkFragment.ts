import { IDmkData } from "./interface/IDmkDate.interface";

export class DmkFragment {
  private _list: Array<IDmkData> = []; 
  private _index: number = 0;
  isSorted = false;
  constructor() {

  }
  push(...dmkData: Array<IDmkData>) {
    this._list.push(...dmkData);
    this.isSorted = false;
  }

  sort() {
    this._list.sort((item1, item2) => item1.timestamp - item2.timestamp);
    this.isSorted = true;
  }

  get() {
    return this._list[this._index];
  }

  delete(id: string) {
    return !!this._list.find((item, index) => {
      if (item.id === id) {
        this._list.splice(index, 1);
        if (index < this._index) {
          this._index --;
        }
        return true
      }
    })
  }

  next() {
    this._index = Math.min(this._index + 1, this._list.length);
  }

  restSize() {
    return this._list.length - this._index;
  }

  resetIdx() {
    this._index = 0;
  }

  flush() {
    if (this._index >= this._list.length) return [];
    let idx = this._index;
    this._index = this._list.length;
    return this._list.slice(idx);
  }

  size() {
    return this._list.length;
  }
}