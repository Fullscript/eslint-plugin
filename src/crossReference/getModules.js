import fs from "node:fs";
import path from "node:path";

const getModules = (absoluteAppPath, dir) => {
  return fs
    .readdirSync(path.resolve(absoluteAppPath, dir))
    .map(name => path.join(dir, name))
    .map(name => `@${name}`);
};

export { getModules };
