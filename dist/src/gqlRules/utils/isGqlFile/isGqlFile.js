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
    isGqlFile: function() {
        return isGqlFile;
    },
    isQueryOrMutationFile: function() {
        return isQueryOrMutationFile;
    }
});
const isGqlFile = (context)=>{
    const filename = context.getFilename();
    return !!filename.match(/\.(mutation|query|fragment|subscription)\.tsx?$/);
};
const isQueryOrMutationFile = (context)=>{
    const filename = context.getFilename();
    return !!filename.match(/\.(mutation|query)\.tsx?$/);
};
