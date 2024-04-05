"use strict";
function _getRequireWildcardCache(nodeInterop) {
    if (typeof WeakMap !== "function") return null;
    var cacheBabelInterop = new WeakMap();
    var cacheNodeInterop = new WeakMap();
    return (_getRequireWildcardCache = function(nodeInterop) {
        return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
    })(nodeInterop);
}
function _interopRequireWildcard(obj, nodeInterop) {
    if (!nodeInterop && obj && obj.__esModule) {
        return obj;
    }
    if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
        return {
            default: obj
        };
    }
    var cache = _getRequireWildcardCache(nodeInterop);
    if (cache && cache.has(obj)) {
        return cache.get(obj);
    }
    var newObj = {};
    var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
    for(var key in obj){
        if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
            var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;
            if (desc && (desc.get || desc.set)) {
                Object.defineProperty(newObj, key, desc);
            } else {
                newObj[key] = obj[key];
            }
        }
    }
    newObj.default = obj;
    if (cache) {
        cache.set(obj, newObj);
    }
    return newObj;
}
let mockPath;
const initMocks = ()=>{
    jest.doMock("path", ()=>mockPath);
};
describe("relativePathToFile", ()=>{
    it("removes the absolute portion of the path", async ()=>{
        mockPath = {
            resolve: jest.fn(()=>"/Users/foo/Dev/hw-admin/eslint/GqlRules/GqlOperationName/GqlOperationName.js")
        };
        initMocks();
        const { relativePathToFile  } = await Promise.resolve().then(()=>/*#__PURE__*/ _interopRequireWildcard(require("./relativePathToFile")));
        const relativeProjectFilename = "app/javascript/shared/data/queries/foobar.js";
        const filenamePath = relativePathToFile({
            getPhysicalFilename: ()=>`/Users/foo/Dev/hw-admin/${relativeProjectFilename}`
        });
        expect(filenamePath).toEqual(relativeProjectFilename);
    });
});
