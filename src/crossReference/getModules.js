import fs from "fs";
import path from "path";

const getModules = (absoluteAppPath, dir) => {
  return fs
    .readdirSync(path.resolve(absoluteAppPath, dir))
    .map(name => path.join(dir, name))
    .map(name => `@${name}`);
};

export { getModules };
