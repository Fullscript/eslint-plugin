"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    isQuery: ()=>_isQuery.isQuery,
    isMutation: ()=>_isMutation.isMutation
});
const _isQuery = require("./isQuery");
const _isMutation = require("./isMutation");
