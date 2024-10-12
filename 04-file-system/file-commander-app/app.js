const fs = require("fs/promises");

(async () => {
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

        console.log(buffer.toString("utf-8"));
    });

    //Create Watcher...
    const watcher = fs.watch("./command.txt");

    for await (const event of watcher) {
        if (event.eventType === "change") {
            commandFileHandler.emit("change");
        }
    }
})();
