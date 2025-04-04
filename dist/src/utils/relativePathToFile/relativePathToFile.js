"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "relativePathToFile", {
    enumerable: true,
    get: function() {
        return relativePathToFile;
    }
});
const _path = require("path");
const relativePathToFile = (context)=>{
    const filenameAbsolutePath = context.getPhysicalFilename();
    const pathToRepo = (0, _path.resolve)().split("/eslint")[0];
    return filenameAbsolutePath.replace(`${pathToRepo}/`, "");
};
