interface IPursuitItem {
    position: number;
    speed: number;
}
export declare class DmkUtil {
    static getFragmIdx(timestamp: number, range: number): number;
    static isDef(value: any): boolean;
    static ifCanCatchUp(item1: IPursuitItem, item2: IPursuitItem, ditance: number): boolean;
    static forEachDelete(arr: Array<any>, iterator: Function): void;
    static sizeMesurer: any;
    static measureSize(content: string, fontSize?: number, lineHeight?: number): {
        width: any;
        height: any;
    };
    static countSpeed(): void;
}
export {};
