"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "escapeString", {
    enumerable: true,
    get: function() {
        return escapeString;
    }
});
const escapeString = (string)=>string.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");
