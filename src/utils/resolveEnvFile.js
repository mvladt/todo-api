import path from "path";
import { fileURLToPath } from "url";

export default function () {
  const pathToCurrentFile = fileURLToPath(import.meta.url); // to ./resolveEnvFile.js
  const pathToEnvFile = path.normalize(`${pathToCurrentFile}/../../../.env`);
  return pathToEnvFile;
}
