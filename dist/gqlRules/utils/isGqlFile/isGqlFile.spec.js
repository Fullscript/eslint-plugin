"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _isGqlFile = require("./isGqlFile");
describe("isGqlFile", ()=>{
    it.each([
        "bla.foo.ts",
        "bla.query.gql"
    ])("returns false if the filename does not match the TS gql file extensions", (filename)=>{
        expect((0, _isGqlFile.isGqlFile)({
            getFilename: ()=>filename
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
describe("isNativeGqlFile", ()=>{
    it("returns false if the filename does not match the gql file extensions", ()=>{
        expect((0, _isGqlFile.isNativeGqlFile)({
            getFilename: ()=>"bla.query.ts"
        })).toBeFalsy();
    });
    it.each([
        "foobar.mutation.gql",
        "foobar.query.gql",
        "foobar.query.graphql",
        "foobar.fragment.gql",
        "foobar.subscription.gql"
    ])("returns true for filenames with the proper gql file extensions", (filename)=>{
        expect((0, _isGqlFile.isNativeGqlFile)({
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
    ])("returns true for filenames with the proper TS gql file extensions", (filename)=>{
        expect((0, _isGqlFile.isQueryOrMutationFile)({
            getFilename: ()=>filename
        })).toBeFalsy();
    });
});
