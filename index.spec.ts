import { test } from "ava";
import { find, gmatch, gsub, format, match } from "./index";

test("find with normal pattern", t => {
    const result = find("bonjour", "on");
    t.deepEqual(result, [2, 3]);
});

test("find with normal pattern but don't find", t => {
    const result = find("bonjour", "zn");
    t.deepEqual(result, []);
});

test("find with complex pattern", t => {
    const result = find("bonjour", "^[%a_][%w_]*[.:]?[%w_.]*");
    t.deepEqual(result, [1, 7]);
});


test("find with complex pattern, no result", t => {
    const result = find(",test", "^[%a_][%w_]*[.:]?[%w_.]*");
    t.deepEqual(result, []);
});

test("find with pattern", t => {
    const result = find("bonjour", "o%w");
    t.deepEqual(result, [2, 3]);
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

test("format with %%", t => {
    const result = format("un %s %%w truc %d", "azz", 12);
    t.is(result, "un azz %w truc 12");
})

test("gmatch with line endings", t => {
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

test("match that removes spaces", t => {
    const result = match(`deathknight="Death_Knight_Frost_T19P"`, "^%s*(.-)%s*$");
    if (result === null) {
        t.fail();
        return;
    }
    t.is(result[0], `deathknight="Death_Knight_Frost_T19P"`);
});

test("match that doesn't match", t => {
    const result = match("actions", `^actions%.([%w_]+)`);
    t.is(result.length, 0);
});

// test("gsub with function", t => {
//     const result = gsub("a text with words", "w(%w)", (s, t) => t + s);
//     t.is(result, "a text ivth ovrds");
// });