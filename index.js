"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const coroutine_1 = require("@wowts/coroutine");
var PatternContext;
(function (PatternContext) {
    PatternContext[PatternContext["Nothing"] = 0] = "Nothing";
    PatternContext[PatternContext["Group"] = 1] = "Group";
})(PatternContext || (PatternContext = {}));
function peek(t) {
    return t[t.length - 1];
}
function compilePattern(pattern, flags) {
    let context = [];
    const tokens = pattern.split("");
    let output = "";
    while (tokens.length > 0) {
        let token = tokens.shift();
        if (token === '[') {
            context.push(PatternContext.Group);
            output += "[";
        }
        else if (token === "]" && peek(context) === PatternContext.Group) {
            context.pop();
            output += "]";
        }
        else if (token === "%") {
            token = tokens.shift();
            switch (token) {
                case "a":
                    if (peek(context) === PatternContext.Group) {
                        output += "A-Za-z";
                    }
                    else {
                        output += "[A-Za-z]";
                    }
                    break;
                case "d":
                    output += "\\d";
                    break;
                case "l":
                    if (peek(context) === PatternContext.Group) {
                        output += "a-z";
                    }
                    else {
                        output += "[a-z]";
                    }
                    break;
                case "s":
                    output += "\\s";
                    break;
                case "u":
                    if (peek(context) === PatternContext.Group) {
                        output += "A-Z";
                    }
                    else {
                        output += "[A-Z]";
                    }
                    break;
                case "w":
                    output += "\\w";
                    break;
                case "x":
                    if (peek(context) === PatternContext.Group) {
                        output += "A-Fa-f0-9";
                    }
                    else {
                        output += "[A-Fa-f0-9]";
                    }
                    break;
                case "z":
                    output += "\\0";
                    break;
                case "%":
                    output += "%";
                    break;
                default:
                    output += "\\" + token;
                    break;
            }
        }
        else if (token == "-") {
            if (peek(context) !== PatternContext.Group) {
                output += "*?";
            }
            else {
                output += "-";
            }
        }
        else if (token == "|") {
            output += "\\|";
        }
        else if (token == ".") {
            if (peek(context) === PatternContext.Group) {
                output += "\\.";
            }
            else {
                output += ".";
            }
        }
        else if (token === "\\") {
            output += "\\\\";
        }
        else {
            output += token;
        }
    }
    return new RegExp(output, flags);
}
function find(t, pattern, start) {
    if (start) {
        t = t.substring(start - 1);
    }
    const regex = compilePattern(pattern);
    let pos = t.search(regex);
    if (pos == -1)
        return [];
    const m = t.match(regex);
    if (!m)
        return [];
    const length = m[0].length;
    if (start) {
        pos += start;
    }
    else {
        pos++;
    }
    return [pos, pos + length - 1];
}
exports.find = find;
function lower(t) {
    return t.toLowerCase();
}
exports.lower = lower;
function sub(t, index, end) {
    return t.substring(index - 1, end);
}
exports.sub = sub;
function len(t) {
    return t.length;
}
exports.len = len;
function format(format, ...values) {
    let index = 0;
    return format.replace(/%(.)/g, (y, x) => x === '%' ? '%' : values[index++]);
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
    const result = text.match(compilePattern(pattern));
    if (result && result.length > 1) {
        return result.slice(1);
    }
    return result;
}
exports.match = match;
function upper(text) {
    return text.toUpperCase();
}
exports.upper = upper;
//# sourceMappingURL=index.js.map