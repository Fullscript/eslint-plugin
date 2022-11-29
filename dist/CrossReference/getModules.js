"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "getModules", {
    enumerable: true,
    get: ()=>getModules
});
const _fs = /*#__PURE__*/ _interopRequireDefault(require("fs"));
const _path = /*#__PURE__*/ _interopRequireDefault(require("path"));
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const getModules = (absoluteAppPath, dir)=>{
    return _fs.default.readdirSync(_path.default.resolve(absoluteAppPath, dir)).map((name)=>_path.default.join(dir, name)).map((name)=>`@${name}`);
};
