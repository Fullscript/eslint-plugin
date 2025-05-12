// types
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
    findByPaths: ()=>findByPaths,
    isArrayExpression: ()=>isArrayExpression,
    isAwaitExpression: ()=>isAwaitExpression,
    isCalleName: ()=>isCalleName,
    isCallExpression: ()=>isCallExpression,
    isExpect: ()=>isExpect,
    isLiteral: ()=>isLiteral,
    isObjectExpression: ()=>isObjectExpression,
    isProperty: ()=>isProperty,
    isSpreadElement: ()=>isSpreadElement,
    isNullOrUndefinedOrVoid: ()=>isNullOrUndefinedOrVoid
});
const isType = (node, type)=>{
    return (node === null || node === void 0 ? void 0 : node.type) === type;
};
const isCallExpression = (node)=>isType(node, "CallExpression");
const isObjectExpression = (node)=>isType(node, "ObjectExpression");
const isArrayExpression = (node)=>isType(node, "ArrayExpression");
const isSpreadElement = (node)=>isType(node, "SpreadElement");
const isLiteral = (node)=>isType(node, "Literal");
const isIdentifier = (node)=>isType(node, "Identifier");
const isUnaryExpression = (node)=>isType(node, "UnaryExpression");
const isAwaitExpression = (node)=>isType(node, "AwaitExpression");
const isProperty = (node)=>isType(node, "Property");
const isNull = (node)=>{
    return isLiteral(node) && (node === null || node === void 0 ? void 0 : node.value) === null;
};
const isUndefined = (node)=>{
    return isIdentifier(node) && (node === null || node === void 0 ? void 0 : node.name) === "undefined";
};
const isVoid = (node)=>{
    return isUnaryExpression(node) && (node === null || node === void 0 ? void 0 : node.operator) === "void";
};
const isNullOrUndefinedOrVoid = (node)=>isNull(node) || isUndefined(node) || isVoid(node);
// calee
const isCalleName = (node, name)=>{
    var _node_callee;
    return (node === null || node === void 0 ? void 0 : (_node_callee = node.callee) === null || _node_callee === void 0 ? void 0 : _node_callee.name) === name;
};
const isExpect = (node)=>isCalleName(node, "expect");
// finder
const findNode = (path, tree)=>{
    if (!tree || !path) return null;
    const current = path.shift();
    if (!isType(tree, current)) return null;
    else if (path.length === 0) return tree;
    return findNode(path, tree.parent);
};
const findByPaths = (paths, tree)=>{
    for (const path of paths){
        const found = findNode([
            ...path
        ], tree);
        if (found) return found;
    }
    return null;
};
