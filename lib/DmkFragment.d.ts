import { IDmkData } from "./interface/IDmkDate.interface";
export declare class DmkFragment {
    private _list;
    private _index;
    isSorted: boolean;
    constructor();
    push(...dmkData: Array<IDmkData>): void;
    sort(): void;
    get(): IDmkData;
    delete(id: string): boolean;
    next(): void;
    restSize(): number;
    resetIdx(): void;
    flush(): IDmkData[];
    size(): number;
}
