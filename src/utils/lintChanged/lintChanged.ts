import { execSync } from 'node:child_process';
import path from 'node:path';

// Cache for batch mode operations
let batchCache: { files: Set<string>; baseBranch: string; newFilesOnly: boolean } | null = null;

/**
 * Get all changed files using batch git operations
 */
const getBatchChangedFiles = (baseBranch: string, newFilesOnly: boolean = false): Set<string> => {
  if (batchCache &&
      batchCache.baseBranch === baseBranch &&
      batchCache.newFilesOnly === newFilesOnly) {
    return batchCache.files;
  }

  const changedFiles = new Set<string>();

  try {
    let commands: string[];

    if (newFilesOnly) {
      commands = [
        // Untracked files (completely new)
        'git ls-files --others --exclude-standard',
        // Files that don't exist in the base branch (new in this branch)
        `git diff --name-only --diff-filter=A ${baseBranch}...HEAD`,
        // Staged new files
        'git diff --cached --name-only --diff-filter=A',
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

    commands.forEach(cmd => {
      const result = execSync(cmd, {
        encoding: 'utf8',
        stdio: 'pipe',
        cwd: process.cwd()
      }).trim();

      if (result) {
        result.split('\n').forEach(file => {
          if (file) changedFiles.add(path.resolve(file));
        });
      }
    });

    // Cache the results
    batchCache = { files: changedFiles, baseBranch, newFilesOnly };

  } catch (error) {
    console.warn('Batch git check failed:', error.message);
  }

  return changedFiles;
};

/**
 * Check if a specific file is NEW (not just modified)
 */
const isNewFile = (filePath: string, baseBranch: string): boolean => {
  try {
    // Untracked file OR file new to this branch OR staged new file
    const result = execSync(
      `git ls-files --others --exclude-standard -- "${filePath}" 2>/dev/null || git diff --name-only --diff-filter=A ${baseBranch}...HEAD -- "${filePath}" 2>/dev/null || git diff --cached --name-only --diff-filter=A -- "${filePath}" 2>/dev/null`,
      {
        encoding: 'utf8',
        stdio: 'pipe',
        cwd: process.cwd()
      }
    ).trim();

    const isNew = result.length > 0;
    return isNew;

  } catch (error) {
    return false;
  }
};

/**
 * Check if we're in a development environment
 */
const isDevelopmentMode = (): boolean => {
  return !process.env.CI && !process.env.TIMING;
};

export const shouldFileBeLinted = (fileTargetting: 'all' | 'new' | 'modified', fileName: string, baseBranch: string, developmentMode: boolean | undefined): boolean => {
  // If fileTargetting is set to all or not a recognized value, return true
  if (fileTargetting === 'all' || (fileTargetting !== 'new' && fileTargetting !== 'modified')) return true;

  const newFilesOnly = fileTargetting === 'new';

  if (developmentMode ?? isDevelopmentMode()) {
    return newFilesOnly ? isNewFile(fileName, baseBranch) : true;
  }

  // CI / Full suite run needs to batch git operations
  const changedFiles = getBatchChangedFiles(baseBranch, newFilesOnly);
  const absoluteFileName = path.resolve(fileName);

  // If no changed files found, don't lint anything
  // If changed files found, only lint files that are in the changed set
  return changedFiles.size > 0 && changedFiles.has(absoluteFileName);
};

