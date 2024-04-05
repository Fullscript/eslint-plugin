"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "getModules", {
    enumerable: true,
    get: ()=>getModules
});
const _nodeFs = /*#__PURE__*/ _interopRequireDefault(require("node:fs"));
const _nodePath = /*#__PURE__*/ _interopRequireDefault(require("node:path"));
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const getModules = (absoluteAppPath, dir)=>{
    const hoge = 1;
    hoge.length;
    return _nodeFs.default.readdirSync(_nodePath.default.resolve(absoluteAppPath, dir)).map((name)=>_nodePath.default.join(dir, name)).map((name)=>`@${name}`);
};
