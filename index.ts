import { makeLuaIterable, LuaIterable } from "@wowts/coroutine";

enum PatternContext {
    Nothing,
    Group
}

function peek<T>(t: T[]) {
    return t[t.length - 1];
}

function compilePattern(pattern: string, flags?: string) {
    let context: PatternContext[] = [];
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
                    output +=  "\\s";
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
                    output +=  "\\0";
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

export function find(t: string, pattern: string, start?:number):number[] {
    if (start) {
        t = t.substring(start - 1);
    }
    const regex = compilePattern(pattern)
    
    let pos = t.search(regex);
    if (pos == -1) return [];
    const m = t.match(regex);
    if (!m) return [];
    const length = m[0].length;
    if (start) {
        pos += start;
    }
    else {
        pos++;
    }
    return [pos, pos + length - 1];
}

export function lower(t: string) {
    return t.toLowerCase();
}

export function sub(t: string, index: number, end?:number) {
    return t.substring(index - 1, end);
}

export function len(t: string) {
    return t.length;
}

export function format(format: string, ...values:any[]) {
    let index = 0;
    return format.replace(/%(.)/g, (y,x) => x === '%' ? '%' : values[index++]); 
}

export function gmatch(text: string, pattern: string): LuaIterable<string> | undefined {
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
    const result = text.match(compilePattern(pattern)); 
    if (!result) return [];
    if (result && result.length > 1) {
        return result.slice(1);
    }
    return result;
}
export function upper(text: string) {
    return text.toUpperCase();
}