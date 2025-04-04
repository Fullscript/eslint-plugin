"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ruleTester", {
    enumerable: true,
    get: function() {
        return ruleTester;
    }
});
const _ruletester = require("@typescript-eslint/rule-tester");
const ruleTester = new _ruletester.RuleTester({
    parser: "@typescript-eslint/parser",
    parserOptions: {
        project: "./tsconfig.json"
    },
    defaultFilenames: {
        ts: "src/index.ts",
        tsx: ""
    }
});
