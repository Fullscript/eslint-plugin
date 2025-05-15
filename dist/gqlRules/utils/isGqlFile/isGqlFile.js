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
    isNativeGqlFile: ()=>isNativeGqlFile,
    isGqlFile: ()=>isGqlFile,
    isQueryOrMutationFile: ()=>isQueryOrMutationFile
});
const isGqlFile = (context)=>{
    const filename = context.getFilename();
    return !!filename.match(/\.(mutation|query|fragment|subscription)\.(ts|tsx)$/);
};
const isNativeGqlFile = (context)=>{
    const filename = context.getFilename();
    return !!filename.match(/\.(mutation|query|fragment|subscription)\.(gql|graphql)$/);
};
const isQueryOrMutationFile = (context)=>{
    const filename = context.getFilename();
    return !!filename.match(/\.(mutation|query)\.(ts|tsx|gql|graphql)$/);
};
