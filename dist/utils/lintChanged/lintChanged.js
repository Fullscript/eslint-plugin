"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "shouldFileBeLinted", {
    enumerable: true,
    get: ()=>shouldFileBeLinted
});
const _childProcess = require("child_process");
const _path = /*#__PURE__*/ _interopRequireDefault(require("path"));
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
// Cache for batch mode operations
let batchCache = null;
/**
 * Get all changed files using batch git operations
 */ const getBatchChangedFiles = (baseBranch, newFilesOnly = false)=>{
    if (batchCache && batchCache.baseBranch === baseBranch && batchCache.newFilesOnly === newFilesOnly) {
        return batchCache.files;
    }
    const changedFiles = new Set();
    try {
        let commands;
        if (newFilesOnly) {
            commands = [
                // Untracked files (completely new)
                'git ls-files --others --exclude-standard',
                // Files that don't exist in the base branch (new in this branch)
                `git diff --name-only --diff-filter=A ${baseBranch}...HEAD`,
                // Staged new files
                'git diff --cached --name-only --diff-filter=A'
            ];
        } else {
            commands = [
                // All files changed between base branch and current HEAD
                `git diff --name-only ${baseBranch}...HEAD`,
                // Untracked files
                'git ls-files --others --exclude-standard',
                // Staged changes
                'git diff --cached --name-only',
                // Unstaged changes
                'git diff --name-only'
            ];
        }
        commands.forEach((cmd)=>{
            const result = (0, _childProcess.execSync)(cmd, {
                encoding: 'utf8',
                stdio: 'pipe',
                cwd: process.cwd()
            }).trim();
            if (result) {
                result.split('\n').forEach((file)=>{
                    if (file) changedFiles.add(_path.default.resolve(file));
                });
            }
        });
        // Cache the results
        batchCache = {
            files: changedFiles,
            baseBranch,
            newFilesOnly
        };
    } catch (error) {
        console.warn('Batch git check failed:', error.message);
    }
    return changedFiles;
};
/**
 * Check if a specific file is NEW (not just modified)
 */ const isNewFile = (filePath, baseBranch)=>{
    try {
        // Untracked file OR file new to this branch OR staged new file
        const result = (0, _childProcess.execSync)(`git ls-files --others --exclude-standard -- "${filePath}" 2>/dev/null || git diff --name-only --diff-filter=A ${baseBranch}...HEAD -- "${filePath}" 2>/dev/null || git diff --cached --name-only --diff-filter=A -- "${filePath}" 2>/dev/null`, {
            encoding: 'utf8',
            stdio: 'pipe',
            cwd: process.cwd()
        }).trim();
        const isNew = result.length > 0;
        return isNew;
    } catch (error) {
        return false;
    }
};
/**
 * Check if we're in a development environment
 */ const isDevelopmentMode = ()=>{
    return !process.env.CI && !process.env.TIMING;
};
const shouldFileBeLinted = (fileName, baseBranch, newFilesOnly, developmentMode)=>{
    if (developmentMode ?? isDevelopmentMode()) {
        return newFilesOnly ? isNewFile(fileName, baseBranch) : true;
    }
    // CI / Full suite run needs to batch git operations
    const changedFiles = getBatchChangedFiles(baseBranch, newFilesOnly);
    const absoluteFileName = _path.default.resolve(fileName);
    // If no changed files found, don't lint anything
    // If changed files found, only lint files that are in the changed set
    return changedFiles.size > 0 && changedFiles.has(absoluteFileName);
};
