"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ruleTester", {
    enumerable: true,
    get: ()=>ruleTester
});
const _ruleTester = require("@typescript-eslint/rule-tester");
const ruleTester = new _ruleTester.RuleTester({
    parser: "@typescript-eslint/parser",
    parserOptions: {
        project: "./tsconfig.json"
    },
    defaultFilenames: {
        ts: "src/index.ts",
        tsx: ""
    }
});
