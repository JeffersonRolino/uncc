/***************************************************************
 * Promise API
 ***************************************************************/
// const fs = require("fs/promises");

// (async () => {
//     try {
//         await fs.copyFile("text.txt", "copied-promise.txt");
//     } catch (error) {
//         console.log(error);
//     }
// })();

/***************************************************************
 * Callback API
 ***************************************************************/
// const fs = require("fs");

// fs.copyFile("text.txt", "copied-callback.txt", (error) => {
//     if (error) console.log(error);
// });

/***************************************************************
 * Callback API
 ***************************************************************/
const fs = require("fs");

fs.copyFileSync("text.txt", "copied-sync.txt");
