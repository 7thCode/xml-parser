/**
 * Copyright © 2020 2021 2022 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */
"use strict";
export class StructScanner {
    constructor() {
        this.current_path = [];
    }
    static isValue(value) {
        return ((value !== null) && (typeof value !== 'undefined'));
    }
    static isContainer(value) {
        return ((value !== null) && (typeof value === 'object'));
    }
    Scan(s, path_dict) {
        this.current_path = [];
        this._Scan(s, {}, "", path_dict);
    }
    _Scan(current, parent, attribute, path_dict) {
        if (StructScanner.isValue(current)) {
            if (StructScanner.isContainer(current)) {
                Object.keys(current).forEach((attr) => {
                    this.current_path.push(attr);
                    this._Scan(current[attr], current, attr, path_dict);
                    this.current_path.pop();
                });
            }
            else {
                this.onValue(parent, attribute, this.toPath(this.current_path), path_dict);
            }
        }
    }
}
export class PathScanner extends StructScanner {
    constructor() {
        super();
    }
    onValue(container, attribute, path, path_dict) {
        const current = container[attribute];
        switch (current) { // filter special types.
            case "":
            case false:
            case null:
            case undefined:
                break;
            default:
                const key_string = current.toString();
                path_dict[key_string] = path;
                break;
        }
    }
    toPath(value) {
        let result = "";
        value.forEach((s) => {
            result += "/" + s;
        });
        return result;
    }
}
export class PathDictBuilder extends StructScanner {
    constructor() {
        super();
    }
    onValue(container, attribute, path, path_dict) {
        const current = container[attribute];
        switch (current) { // filter special types.
            case "":
            case false:
            case null:
            case undefined:
                break;
            default:
                const key_string = current.toString();
                if (!(key_string in path_dict)) {
                    path_dict[key_string] = [];
                }
                path_dict[key_string].push(path);
                break;
        }
    }
    toPath(value) {
        let result = "";
        value.forEach((s) => {
            result += "/" + s;
        });
        return result;
    }
}
export class ValueCollecter extends StructScanner {
    constructor() {
        super();
    }
    onValue(container, attribute, path, path_dict) {
        const current = container[attribute];
        switch (current) { // filter special types.
            case "":
            case false:
            case null:
            case undefined:
                break;
            default:
                const key_string = current.toString();
                path_dict[path] = key_string;
                break;
        }
    }
    toPath(value) {
        let result = "";
        value.forEach((s) => {
            result += "/" + s;
        });
        return result;
    }
}
export class StructRenderer extends StructScanner {
    constructor() {
        super();
    }
    onValue(container, attribute, path, path_dict) {
        const value = path_dict[path];
        if (value) {
            container[attribute] = value;
        }
    }
    toPath(value) {
        let result = "";
        value.forEach((s) => {
            result += "/" + s;
        });
        return result;
    }
}
export class StructTransformer {
    constructor(from, to) {
        this.from_dict = {};
        this.to_dict = {};
        const from_scanner = new PathScanner();
        const to_scanner = new PathDictBuilder();
        from_scanner.Scan(from, this.from_dict);
        to_scanner.Scan(to, this.to_dict);
    }
    Transform(before, after) {
        const value_collector = new ValueCollecter();
        const struct_renderer = new StructRenderer();
        const relation = {};
        const values = {};
        value_collector.Scan(before, values);
        Object.keys(this.from_dict).forEach((key) => {
            const key_string = key.toString();
            const from = this.from_dict[key_string];
            const to = this.to_dict[key_string];
            if (from && to) {
                to.forEach((key) => {
                    relation[key] = values[from];
                });
            }
        });
        struct_renderer.Scan(after, relation);
    }
}
