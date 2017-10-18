"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ava_1 = require("ava");
const index_1 = require("./index");
ava_1.test("find with normal pattern", t => {
    const result = index_1.find("bonjour", "on");
    t.deepEqual(result, [2, 4]);
});
ava_1.test("find with normal pattern but don't find", t => {
    const result = index_1.find("bonjour", "zn");
    t.deepEqual(result, []);
});
ava_1.test("find with complex pattern", t => {
    const result = index_1.find("bonjour", "^[%a_][%w_]*[.:]?[%w_.]*");
    t.deepEqual(result, [1, 8]);
});
ava_1.test("find with pattern", t => {
    const result = index_1.find("bonjour", "o%w");
    t.deepEqual(result, [2, 4]);
});
ava_1.test("gmatch", t => {
    const result = index_1.gmatch("a text with words", "%w+");
    t.not(result, undefined);
    if (result == undefined)
        return;
    const results = [];
    for (;;) {
        const value = result();
        if (!value)
            break;
        results.push(value);
    }
    t.deepEqual(results, ["a", "text", "with", "words"]);
});
ava_1.test("gsub", t => {
    const result = index_1.gsub("a text with words", "w", "v");
    t.is(result, "a text vith vords");
});
ava_1.test("gsub with captures", t => {
    const result = index_1.gsub("a text with words", "w(%w)", "%1v");
    t.is(result, "a text ivth ovrds");
});
ava_1.test("gsub with captures", t => {
    const result = index_1.gsub("hello world", "(%w+)", "%1 %1");
    t.is(result, "hello hello world world");
});
ava_1.test("gsub with captures %0", t => {
    const result = index_1.gsub("hello world", "%w+", "%0 %0");
    t.is(result, "hello hello world world");
});
ava_1.test("gsub with two captures", t => {
    const result = index_1.gsub("hello world from Lua", "(%w+)%s*(%w+)", "%2 %1");
    t.is(result, "world hello Lua from");
});
ava_1.test.failing("gsub with function", t => {
    const result = index_1.gsub("4+5 = $return 4+5$", "%$(.-)%$", s => {
        return eval(s);
    });
    t.is(result, "4+5 = 9");
});
ava_1.test("format", t => {
    const result = index_1.format("un %s truc %d", "azz", 12);
    t.is(result, "un azz truc 12");
});
ava_1.test("gmatch with line endings", t => {
    const result = [];
    const iterable = index_1.gmatch("first\r\nsecond", "[^\r\n]+");
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
});
ava_1.test("match that removes spaces", t => {
    const result = index_1.match(`deathknight="Death_Knight_Frost_T19P"`, "^%s*(.-)%s*$");
    if (result === null) {
        t.fail();
        return;
    }
    t.is(result[0], `deathknight="Death_Knight_Frost_T19P"`);
});
// test("gsub with function", t => {
//     const result = gsub("a text with words", "w(%w)", (s, t) => t + s);
//     t.is(result, "a text ivth ovrds");
// }); 
//# sourceMappingURL=index.spec.js.map