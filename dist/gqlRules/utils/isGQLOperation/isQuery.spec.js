"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _isQuery = require("./isQuery");
describe("isQuery", ()=>{
    describe("when operationText starts with 'query'", ()=>{
        it("returns true", ()=>{
            expect((0, _isQuery.isQuery)("query something {")).toBeTruthy();
        });
    });
    describe("when operationText starts with 'mutation'", ()=>{
        it("returns false", ()=>{
            expect((0, _isQuery.isQuery)("mutation something {")).toBeFalsy();
        });
    });
});
