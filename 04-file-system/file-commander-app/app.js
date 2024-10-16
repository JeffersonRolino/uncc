const fs = require("fs/promises");

(async () => {
  // commands
  const CREATE_FILE = "create a file";
  const DELETE_FILE = "delete a file";
  const RENAME_FILE = "rename a file";
  const ADD_TO_FILE = "add to file";

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

  const deleteFile = async (path) => {
    try {
      await fs.unlink(path);
      console.log(`Successfully deleted the file ${path}`);
    } catch (error) {
      if (error.code === "ENOENT") {
        console.log("No file at this path to rename...");
      } else {
        console.error("There was an error: ", error.message);
      }
    }
  };

  const renameFile = async (oldPath, newPath) => {
    try {
      await fs.rename(oldPath, newPath);
      console.log(`Successfully rename ${oldPath} to ${newPath}`);
    } catch (error) {
      if (error.code === "ENOENT") {
        console.log("No file at this path to rename...");
      } else {
        console.error(
          "There was a error trying to rename the file ",
          error.message
        );
      }
    }
  };

  let addedContent = null;

  const addToFile = async (path, content) => {
    if (addedContent === content) return;
    addedContent = content;

    try {
      const fileHandle = await fs.open(path, "a");
      fileHandle.write(content);
    } catch (error) {
      console.error(
        "There was a error trying to add content to the file ",
        error.message
      );
    }

    console.log(`Adding to file ${path} this content: ${content}`);
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

    // CREATE A FILE: create a file <path>
    if (command.includes(CREATE_FILE)) {
      const filePath = command.substring(CREATE_FILE.length + 1);
      createFile(filePath);
    }

    // DELETE A FILE: delete a file <path>
    if (command.includes(DELETE_FILE)) {
      const filePath = command.substring(DELETE_FILE.length + 1);
      deleteFile(filePath);
    }

    if (command.includes(RENAME_FILE)) {
      const index = command.indexOf(" to ");
      const oldFilePath = command.substring(RENAME_FILE.length + 1, index);
      const newFilePath = command.substring(index + 4);

      renameFile(oldFilePath, newFilePath);
    }

    if (command.includes(ADD_TO_FILE)) {
      const index = command.indexOf(" this content: ");
      const filePath = command.substring(ADD_TO_FILE.length + 1, index);
      const content = command.substring(index + 15);
      addToFile(filePath, content);
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
