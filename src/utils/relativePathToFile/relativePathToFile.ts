import { resolve } from "path";

const relativePathToFile = context => {
  const filenameAbsolutePath = context.getPhysicalFilename();
  const pathToRepo = resolve().split("/eslint")[0];

  return filenameAbsolutePath.replace(`${pathToRepo}/`, "");
};

export { relativePathToFile };
