import * as fs from "fs";
import * as glob from "glob";

export class FileUtils {

  private static locks: Array<string> = [];

  public static writeFile(filename: string, data: unknown): void {
    this.locks.push(filename);
    let fd;
    try {
      fd = fs.openSync(filename, "w");
      fs.appendFileSync(fd, JSON.stringify(data));
    } catch (e) {
      console.error("Error writing file", filename, e);
      throw e;
    } finally {
      if (fd) {
        fs.closeSync(fd);
      }
      const index = this.locks.indexOf(filename);
      if (index > -1) {
        this.locks = this.locks.splice(index, 1);
      }
    }
  }

  public static async readFile(filename: string): Promise<string> {
    let locked = this.locks.includes(filename);
    while (locked) {
      await new Promise(resolve => setTimeout(resolve, 500));
      locked = this.locks.includes(filename);
    }

    try {
      return fs.readFileSync(filename, "utf8");
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  public static getFiles(pattern: string): string[] {
    return glob.sync(pattern, { nonull: false });
  }
}
