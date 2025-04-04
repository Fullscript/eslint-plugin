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
    NO_GLOBAL_LET_IN_TESTS_ERROR_KEY: ()=>NO_GLOBAL_LET_IN_TESTS_ERROR_KEY,
    NO_GLOBAL_OBJECT_IN_TESTS_ERROR_KEY: ()=>NO_GLOBAL_OBJECT_IN_TESTS_ERROR_KEY
});
const NO_GLOBAL_LET_IN_TESTS_ERROR_KEY = "noGlobalLetInTests";
const NO_GLOBAL_OBJECT_IN_TESTS_ERROR_KEY = "noGlobalObjectInTests";
