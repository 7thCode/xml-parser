/**
 * Copyright © 2020 2021 2022 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */
export declare abstract class StructScanner {
    private current_path;
    constructor();
    protected static isValue(value: unknown): boolean;
    protected static isContainer(value: unknown): boolean;
    abstract onValue(container: any, attribute: string, path: string, path_dict: any): void;
    abstract toPath(value: string[]): any;
    Scan(s: any, path_dict: any): void;
    protected _Scan(current: any, parent: any, attribute: string, path_dict: any): void;
}
export declare class PathScanner extends StructScanner {
    constructor();
    onValue(container: any, attribute: string, path: string, path_dict: any): void;
    toPath(value: string[]): any;
}
export declare class PathDictBuilder extends StructScanner {
    constructor();
    onValue(container: any, attribute: string, path: string, path_dict: any): void;
    toPath(value: string[]): any;
}
export declare class ValueCollecter extends StructScanner {
    constructor();
    onValue(container: any, attribute: string, path: string, path_dict: any): void;
    toPath(value: string[]): any;
}
export declare class StructRenderer extends StructScanner {
    constructor();
    onValue(container: any, attribute: string, path: string, path_dict: any): void;
    toPath(value: string[]): any;
}
export declare class StructTransformer {
    private from_dict;
    private to_dict;
    constructor(from: any, to: any);
    Transform(before: any, after: any): void;
}
//# sourceMappingURL=index.d.ts.map