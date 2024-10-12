const fs = require("fs/promises");

(async () => {
    // commands
    const CREATE_FILE = "create a file";

    const createFile = async (path) => {
        try {
            // We want to check whether or not we already have that file
            const existingFIleHandle = await fs.open(path, "r");
            existingFIleHandle.close();

            // We already have that file...
            return console.log(`The file ${path} already exists...`);
        } catch (e) {
            // We don't have the file, now we should create it
            const newFileHandle = await fs.open(path, "w");
            console.log("A new file was successfully created...");
        }
    };

    const commandFileHandler = await fs.open("./command.txt", "r");

    commandFileHandler.on("change", async () => {
        //Get the size of our file
        const size = (await commandFileHandler.stat()).size;

        //Allocate our buffer with the size of the file
        const buffer = Buffer.alloc(size);

        //The location at which we want to start filling our buffer
        const offset = 0;

        //How many bytes we want to read
        const length = buffer.byteLength;

        //The position that we want to start reading from;
        const position = 0;

        //We always want to read the whole content
        const content = await commandFileHandler.read(
            buffer,
            offset,
            length,
            position
        );

        const command = buffer.toString("utf-8");

        // Create a file: create a file <path>
        if (command.includes(CREATE_FILE)) {
            const filePath = command.substring(CREATE_FILE.length + 1);
            createFile(filePath);
        }
    });

    //Create Watcher...
    const watcher = fs.watch("./command.txt");

    for await (const event of watcher) {
        if (event.eventType === "change") {
            commandFileHandler.emit("change");
        }
    }
})();
