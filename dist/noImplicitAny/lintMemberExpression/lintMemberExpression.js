"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "lintMemberExpression", {
    enumerable: true,
    get: ()=>lintMemberExpression
});
const _utils = require("@typescript-eslint/utils");
const _types = require("@typescript-eslint/types");
const _messageIds = require("../messageIds");
const _typescript = /*#__PURE__*/ _interopRequireWildcard(require("typescript"));
function _getRequireWildcardCache(nodeInterop) {
    if (typeof WeakMap !== "function") return null;
    var cacheBabelInterop = new WeakMap();
    var cacheNodeInterop = new WeakMap();
    return (_getRequireWildcardCache = function(nodeInterop) {
        return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
    })(nodeInterop);
}
function _interopRequireWildcard(obj, nodeInterop) {
    if (!nodeInterop && obj && obj.__esModule) {
        return obj;
    }
    if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
        return {
            default: obj
        };
    }
    var cache = _getRequireWildcardCache(nodeInterop);
    if (cache && cache.has(obj)) {
        return cache.get(obj);
    }
    var newObj = {};
    var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
    for(var key in obj){
        if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
            var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;
            if (desc && (desc.get || desc.set)) {
                Object.defineProperty(newObj, key, desc);
            } else {
                newObj[key] = obj[key];
            }
        }
    }
    newObj.default = obj;
    if (cache) {
        cache.set(obj, newObj);
    }
    return newObj;
}
// Check if a given node has a type annotation in ancestors by traversing up AST.
function hasTypeAnnotationInAncestorNode(parserServices, node) {
    if (node.object.type === _types.AST_NODE_TYPES.TSAsExpression) {
        return true;
    } else if (node.object.type === _types.AST_NODE_TYPES.Identifier) {
        const symbol = parserServices.getSymbolAtLocation(node.object);
        if (symbol && symbol.valueDeclaration) {
            const declaration = parserServices.tsNodeToESTreeNodeMap.get(symbol.valueDeclaration);
            if (declaration.type === _types.AST_NODE_TYPES.VariableDeclarator) {
                return !!declaration.id.typeAnnotation || declaration.init.type === _types.AST_NODE_TYPES.TSAsExpression;
            } else {
                return false;
            }
        }
        return false;
    } else if (node.object.type === _types.AST_NODE_TYPES.MemberExpression) {
        // Check parent node recursively
        return hasTypeAnnotationInAncestorNode(parserServices, node.object);
    } else {
        return false;
    }
}
const lintMemberExpression = (context, node)=>{
    var _objType_symbol;
    const parserServices = _utils.ESLintUtils.getParserServices(context);
    // If it's not a computed property like `foo.bar`, the node is not implicit any since this expression ensures type safety.
    // If an ancestor node have a type annotation like `(foo as any)['key']['key2']`, the given node is not considered as implicit any.
    if (!node.computed || hasTypeAnnotationInAncestorNode(parserServices, node)) return;
    const nodeType = parserServices.getTypeAtLocation(node);
    const objType = parserServices.getTypeAtLocation(node.object);
    if (nodeType.flags === _typescript.TypeFlags.Any && ((_objType_symbol = objType.symbol) === null || _objType_symbol === void 0 ? void 0 : _objType_symbol.escapedName) !== "Array") {
        context.report({
            node,
            messageId: _messageIds.DETECTED_IMPLICIT_ANY_ERROR_KEY,
            *fix (fixer) {
                // Adjusting the position to insert "as any"
                const getRangeAdjustment = ()=>{
                    if (!node.optional) return 1;
                    if (!node.computed) return 2;
                    return 3;
                };
                yield fixer.insertTextBefore(node, "(");
                yield fixer.insertTextBeforeRange([
                    node.property.range[0] - getRangeAdjustment(),
                    node.property.range[1]
                ], " as any)");
            }
        });
    }
};
