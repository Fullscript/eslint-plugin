"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "getModules", {
    enumerable: true,
    get: function() {
        return getModules;
    }
});
const _nodefs = /*#__PURE__*/ _interop_require_default(require("node:fs"));
const _nodepath = /*#__PURE__*/ _interop_require_default(require("node:path"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const getModules = (absoluteAppPath, dir)=>{
    return _nodefs.default.readdirSync(_nodepath.default.resolve(absoluteAppPath, dir)).map((name)=>_nodepath.default.join(dir, name)).map((name)=>`@${name}`);
};
