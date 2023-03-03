"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "isMutation", {
    enumerable: true,
    get: ()=>isMutation
});
const isMutation = (gqlOperationText)=>{
    return gqlOperationText.startsWith("mutation");
};
