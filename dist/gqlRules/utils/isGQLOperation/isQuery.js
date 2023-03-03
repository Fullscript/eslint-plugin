"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "isQuery", {
    enumerable: true,
    get: ()=>isQuery
});
const isQuery = (gqlOperationText)=>{
    return gqlOperationText.startsWith("query");
};
