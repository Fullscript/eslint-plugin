"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "operationName", {
    enumerable: true,
    get: ()=>operationName
});
const operationName = (gqlOperationText, operationType)=>{
    return gqlOperationText.replace(new RegExp(`^${operationType.toLowerCase()}|\\s+|\\(.*\\)?|\\{?`, "g"), "");
};
