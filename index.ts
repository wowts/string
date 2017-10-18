import { makeLuaIterable, LuaIterable } from "@wowts/coroutine";

function compilePattern(pattern: string, flags?: string) {
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

export function find(t: string, pattern: string, start?:number):number[]|undefined {
    if (start) {
        t = t.substring(start);
    }
    const regex = compilePattern(pattern)
    
    let pos = t.search(regex);
    if (pos == -1) return undefined;
    const m = t.match(regex);
    if (!m) return undefined;
    const length = m[0].length;
    if (start) {
        pos += start;
    }
    else {
        pos++;
    }
    return [pos, pos + length];
}

export function lower(t: string) {
    return t.toLowerCase();
}

export function sub(t: string, index: number, end?:number) {
    return t.substring(index, end);
}

export function len(t: string) {
    return t.length;
}

export function format(format: string, ...values:any[]) {
    let index = 0;
    return format.replace(/%\w/g, () => values[index++]); 
}

export function gmatch(text: string, pattern: string) {
    const result = text.match(compilePattern(pattern, "g"));
    if (!result) return undefined;
    return makeLuaIterable(result);
}

export function gsub(text: string, pattern: string, substitute: string|((...args:string[]) => string)) {
    const regex = compilePattern(pattern, "g");
     if (typeof(substitute) === "string") {
         const sub = substitute.replace(/\$/g, "$$").replace(/%0/g, "$$&").replace(/%/g, "$");
         return text.replace(regex, sub);
     }
    return text.replace(regex, (pattern:string, ...args:string[]) => substitute(...args));
}

export function match(text: string, pattern: string) {
    return text.match(compilePattern(pattern)); 
}
export function upper(text: string) {
    return text.toUpperCase();
}