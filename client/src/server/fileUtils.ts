const fs = require("fs");

export class FileUtils {

    private static filepath = "../gifs/";

    private static locks: Array<string> = [];

    public static writeFile(filename, content) {
        this.locks.push(filename);
        let fd;
        try {
            fd = fs.openSync(`${this.filepath}${filename}.txt`, "w");
            for (let i = 0; i < content.length; i++) {
                fs.appendFileSync(fd, content[i].toString());
                if (i < content.length - 1) {
                    fs.appendFileSync(fd, "\n");
                }
            }
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

    public static async readFile(filename) {
        let locked = this.locks.includes(filename);
        while (locked) {
            await new Promise(resolve => setTimeout(resolve, 500));
            locked = this.locks.includes(filename);
        }

        try {
            return fs.readFileSync(`${this.filepath}${filename}.txt`, "utf8");
        } catch (err) {
            console.error(err);
            throw err;
        }
    }
}
