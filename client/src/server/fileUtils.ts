const fs = require("fs");

export class FileUtils {

    private static filepath = "../gifs/";

    public static writeFile(filename, content) {
        var fd;
        try {
            // fs.writeFileSync(`${this.filepath}+${filename}.txt`, "");
            fd = fs.openSync(`${this.filepath}${filename}.txt`, "w");
            for (let i = 0; i < content.length; i++) {
                fs.appendFileSync(fd, content[i].toString());
                // fs.appendFileSync(`${this.filepath}+${filename}.txt`, content[i].toString());
                // don"t append newline at end of file
                if (i < content.length - 1) {
                    fs.appendFileSync(fd, "\n")
                    // fs.appendFileSync(`${this.filepath}+${filename}.txt`, "\n");
                }
            }
        } catch (e) {
            console.error(e)
            throw e;
        } finally {
            if (fd) {
                fs.closeSync(fd);
            }
        }
    }

    public static readFile(filename) {
        try {
            return fs.readFileSync(`${this.filepath}${filename}.txt`, "utf8");
        } catch (err) {
            console.error(err);
            throw err;
        }
    }
}
