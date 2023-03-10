"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _isMutation = require("./isMutation");
describe("isMutation", ()=>{
    describe("when operationText starts with 'query'", ()=>{
        it("returns false", ()=>{
            expect((0, _isMutation.isMutation)("query something {")).toBeFalsy();
        });
    });
    describe("when operationText starts with 'mutation'", ()=>{
        it("returns true", ()=>{
            expect((0, _isMutation.isMutation)("mutation something {")).toBeTruthy();
        });
    });
});
