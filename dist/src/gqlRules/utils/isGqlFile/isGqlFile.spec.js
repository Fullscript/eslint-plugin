"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _isGqlFile = require("./isGqlFile");
describe("isGqlFile", ()=>{
    it("returns false if the filename does not match the gql file extensions", ()=>{
        expect((0, _isGqlFile.isGqlFile)({
            getFilename: ()=>"foobar.bla.ts"
        })).toBeFalsy();
    });
    it.each([
        "foobar.mutation.ts",
        "foobar.query.tsx",
        "foobar.fragment.ts",
        "foobar.subscription.tsx"
    ])("returns true for filenames with the proper gql file extensions", (filename)=>{
        expect((0, _isGqlFile.isGqlFile)({
            getFilename: ()=>filename
        })).toBeTruthy();
    });
});
describe("isQueryOrMutationFile", ()=>{
    it("returns false if the filename does not match the gql file extensions", ()=>{
        expect((0, _isGqlFile.isQueryOrMutationFile)({
            getFilename: ()=>"foobar.bla.ts"
        })).toBeFalsy();
    });
    it.each([
        "foobar.mutation.ts",
        "foobar.query.tsx"
    ])("returns true for filenames with the proper gql file extensions", (filename)=>{
        expect((0, _isGqlFile.isQueryOrMutationFile)({
            getFilename: ()=>filename
        })).toBeTruthy();
    });
    it.each([
        "foobar.fragment.ts",
        "foobar.subscription.tsx"
    ])("returns true for filenames with the proper gql file extensions", (filename)=>{
        expect((0, _isGqlFile.isQueryOrMutationFile)({
            getFilename: ()=>filename
        })).toBeFalsy();
    });
});
