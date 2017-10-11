"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const coroutine_1 = require("@wowts/coroutine");
function compilePattern(pattern, flags) {
    pattern = pattern.replace(/%([a-z])/g, (pattern, p1) => {
        switch (p1) {
            case "a":
                return "[A-Za-z]";
            case "d":
                return "\\d";
            case "l":
                return "[a-z]";
            case "s":
                return "\\s";
            case "u":
                return "[A-Z]";
            case "w":
                return "\\w";
            case "x":
                return "[A-Fa-f0-9]";
            case "z":
                return "\\0";
            default:
                return p1;
        }
    });
    pattern = pattern.replace(/([\.\]\)])-/g, "$1?");
    pattern = pattern.replace(/%(.)/g, "\\$1");
    return new RegExp(pattern, flags);
}
function find(t, pattern, start) {
    if (start) {
        t = t.substring(start);
    }
    const regex = compilePattern(pattern);
    let pos = t.search(regex);
    if (pos == -1)
        return undefined;
    const m = t.match(regex);
    if (!m)
        return undefined;
    const length = m[0].length;
    if (start) {
        pos += start;
    }
    else {
        pos++;
    }
    return [pos, pos + length];
}
exports.find = find;
function lower(t) {
    return t.toLowerCase();
}
exports.lower = lower;
function sub(t, index, end) {
    return t.substring(index, end);
}
exports.sub = sub;
function len(t) {
    return t.length;
}
exports.len = len;
function format(format, ...values) {
    let index = 0;
    return format.replace(/%\w/g, () => values[index++]);
}
exports.format = format;
function gmatch(text, pattern) {
    const result = text.match(compilePattern(pattern, "g"));
    if (!result)
        return undefined;
    return coroutine_1.makeLuaIterable(result);
}
exports.gmatch = gmatch;
function gsub(text, pattern, substitute) {
    const regex = compilePattern(pattern, "g");
    if (typeof (substitute) === "string") {
        const sub = substitute.replace(/\$/g, "$$").replace(/%0/g, "$$&").replace(/%/g, "$");
        return text.replace(regex, sub);
    }
    return text.replace(regex, (pattern, ...args) => substitute(...args));
}
exports.gsub = gsub;
function match(text, pattern) {
    return text.match(pattern);
}
exports.match = match;
function upper(text) {
    return text.toUpperCase();
}
exports.upper = upper;
//# sourceMappingURL=index.js.map