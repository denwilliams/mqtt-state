import { existsSync, readFile, writeFile } from "fs";
import { promisify } from "util";

const readFileAsync = promisify(readFile);
const writeFileAsync = promisify(writeFile);

export class FileState {
  constructor(private filePath: string) {}

  async save(state: Record<string, any>) {
    await writeFileAsync(this.filePath, JSON.stringify(state), "utf8");
    console.info(`Backed up active state to ${this.filePath}`);
  }

  async load(): Promise<Record<string, any>> {
    if (!existsSync(this.filePath)) return {};
    return JSON.parse(await readFileAsync(this.filePath, "utf8"));
  }
}
