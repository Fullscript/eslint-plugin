"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "isMutation", {
    enumerable: true,
    get: function() {
        return isMutation;
    }
});
const isMutation = (gqlOperationText)=>{
    return gqlOperationText.startsWith("mutation");
};
