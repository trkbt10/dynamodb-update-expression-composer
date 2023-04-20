type Paths = (string | number)[];
export type CompareResult<B = any, A = any> = {
    path: Paths;
    prev: B;
    next: A;
};
export declare function compareTwoObjects(path: (string | number)[], prev: any, next: any): CompareResult[];
export {};
