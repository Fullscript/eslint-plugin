"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _escapeString = require("./escapeString");
describe("escapeString", ()=>{
    it("escapes forward slash", ()=>{
        expect((0, _escapeString.escapeString)("foo/bar")).toBe("foo\\/bar");
    });
    it("escapes back slash", ()=>{
        expect((0, _escapeString.escapeString)("foo\\bar")).toBe("foo\\\\bar");
    });
    it("escapes plus", ()=>{
        expect((0, _escapeString.escapeString)("foo+bar")).toBe("foo\\+bar");
    });
    it("escapes minus", ()=>{
        expect((0, _escapeString.escapeString)("foo-bar")).toBe("foo\\-bar");
    });
    it("escapes left square bracket", ()=>{
        expect((0, _escapeString.escapeString)("foo[bar")).toBe("foo\\[bar");
    });
    it("escapes right square bracket", ()=>{
        expect((0, _escapeString.escapeString)("foo]bar")).toBe("foo\\]bar");
    });
    it("escapes caret", ()=>{
        expect((0, _escapeString.escapeString)("foo^bar")).toBe("foo\\^bar");
    });
    it("escapes dollar sign", ()=>{
        expect((0, _escapeString.escapeString)("foo$bar")).toBe("foo\\$bar");
    });
    it("escapes asterisk", ()=>{
        expect((0, _escapeString.escapeString)("foo*bar")).toBe("foo\\*bar");
    });
    it("escapes question mark", ()=>{
        expect((0, _escapeString.escapeString)("foo?bar")).toBe("foo\\?bar");
    });
    it("escapes period", ()=>{
        expect((0, _escapeString.escapeString)("foo.bar")).toBe("foo\\.bar");
    });
    it("escapes left parentheses", ()=>{
        expect((0, _escapeString.escapeString)("foo(bar")).toBe("foo\\(bar");
    });
    it("escapes right parentheses", ()=>{
        expect((0, _escapeString.escapeString)("foo)bar")).toBe("foo\\)bar");
    });
    it("escapes pipe", ()=>{
        expect((0, _escapeString.escapeString)("foo|bar")).toBe("foo\\|bar");
    });
    it("escapes left curly bracket", ()=>{
        expect((0, _escapeString.escapeString)("foo{bar")).toBe("foo\\{bar");
    });
    it("escapes right curly bracket", ()=>{
        expect((0, _escapeString.escapeString)("foo}bar")).toBe("foo\\}bar");
    });
});
