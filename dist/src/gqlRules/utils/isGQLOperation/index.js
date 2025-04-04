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
    isMutation: function() {
        return _isMutation.isMutation;
    },
    isQuery: function() {
        return _isQuery.isQuery;
    }
});
const _isQuery = require("./isQuery");
const _isMutation = require("./isMutation");
