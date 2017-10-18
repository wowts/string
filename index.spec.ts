import { test } from "ava";
import { find, gmatch, gsub, format, match } from "./index";

test("find with normal pattern", t => {
    const result = find("bonjour", "on");
    t.deepEqual(result, [2, 4]);
});

test("find with normal pattern but don't find", t => {
    const result = find("bonjour", "zn");
    t.is(result, undefined);
});

test("find with pattern", t => {
    const result = find("bonjour", "o%w");
    t.deepEqual(result, [2, 4]);
});

test("gmatch", t => {
    const result = gmatch("a text with words", "%w+");
    t.not(result, undefined);
    if (result == undefined) return;
    const results:string[] = [];
    for(;;) {
        const value = result();
        if (!value) break;
        results.push(value);
    }
    t.deepEqual(results, ["a", "text", "with", "words"]);
});

test("gsub", t => {
    const result = gsub("a text with words", "w", "v");
    t.is(result, "a text vith vords");
});

test("gsub with captures", t => {
    const result = gsub("a text with words", "w(%w)", "%1v");
    t.is(result, "a text ivth ovrds");
});

test("gsub with captures", t => {
    const result = gsub("hello world", "(%w+)", "%1 %1");
    t.is(result, "hello hello world world");
});

test("gsub with captures %0", t => {
    const result = gsub("hello world", "%w+", "%0 %0");
    t.is(result, "hello hello world world");
});

test("gsub with two captures", t => {
    const result = gsub("hello world from Lua", "(%w+)%s*(%w+)", "%2 %1");
    t.is(result, "world hello Lua from");
});

test.failing("gsub with function", t => {
    const result = gsub("4+5 = $return 4+5$", "%$(.-)%$", s => {
        return eval(s); 
    });
    t.is(result, "4+5 = 9");
});

test("format", t => {
    const result = format("un %s truc %d", "azz", 12);
    t.is(result, "un azz truc 12");
});

test("match with line endings", t => {
    const result: string[] = [];
    const iterable = gmatch("first\r\nsecond", "[^\r\n]+");
    if (iterable === undefined) {
        t.fail();
        return;
    }
    for (const m of iterable) {
        result.push(m);
    }
    if (result === null) {
        t.fail();
        return;
    }
    t.is(result[0], "first");
    t.is(result[1], "second");
})

// test("gsub with function", t => {
//     const result = gsub("a text with words", "w(%w)", (s, t) => t + s);
//     t.is(result, "a text ivth ovrds");
// });