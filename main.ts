import { copyFile } from "fs/promises";
import { mkdirp } from "mkdirp";
import path from "path";

async function getConfig() {
  const [relativeConfigPath] = process.argv.slice(2);
  const root = path.resolve(process.cwd());
  const configPath = path.join(root, relativeConfigPath);
  const config = (await import(configPath)).default;
  return config;
}

async function main() {
  const { home, destination, files } = await getConfig();

  await mkdirp(destination);

  for (const file of files) {
    const filename = path.basename(file);
    const baseDir = path.dirname(file).replace(home, "");
    const destDir = path.join(destination, baseDir);
    const destFile = path.join(destDir, filename);

    await mkdirp(destDir);
    await copyFile(file, destFile);
  }
}

main()
  .catch((e) => console.error(e))
  .finally(() => process.exit());
