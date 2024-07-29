import { escapeString } from "./escapeString";

describe("escapeString", () => {
    it("escapes forward slash", () => {
        expect(escapeString("foo/bar")).toBe("foo\\/bar");
    });
    it("escapes back slash", () => {
        expect(escapeString("foo\\bar")).toBe("foo\\\\bar");
    });
    it("escapes plus", () => {
        expect(escapeString("foo+bar")).toBe("foo\\+bar");
    });
    it("escapes minus", () => {
        expect(escapeString("foo-bar")).toBe("foo\\-bar");
    });
    it("escapes left square bracket", () => {
        expect(escapeString("foo[bar")).toBe("foo\\[bar");
    });
    it("escapes right square bracket", () => {
        expect(escapeString("foo]bar")).toBe("foo\\]bar");
    });
    it("escapes caret", () => {
        expect(escapeString("foo^bar")).toBe("foo\\^bar");
    });
    it("escapes dollar sign", () => {
        expect(escapeString("foo$bar")).toBe("foo\\$bar");
    });
    it("escapes asterisk", () => {
        expect(escapeString("foo*bar")).toBe("foo\\*bar");
    });
    it("escapes question mark", () => {
        expect(escapeString("foo?bar")).toBe("foo\\?bar");
    });
    it("escapes period", () => {
        expect(escapeString("foo.bar")).toBe("foo\\.bar");
    });
    it("escapes left parentheses", () => {
        expect(escapeString("foo(bar")).toBe("foo\\(bar");
    });
    it("escapes right parentheses", () => {
        expect(escapeString("foo)bar")).toBe("foo\\)bar");
    });
    it("escapes pipe", () => {
        expect(escapeString("foo|bar")).toBe("foo\\|bar");
    });
    it("escapes left curly bracket", () => {
        expect(escapeString("foo{bar")).toBe("foo\\{bar");
    });
    it("escapes right curly bracket", () => {
        expect(escapeString("foo}bar")).toBe("foo\\}bar");
    });
});

