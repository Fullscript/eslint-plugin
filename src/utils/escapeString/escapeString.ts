export const escapeString = (string: string) =>
    string.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
