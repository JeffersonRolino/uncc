const MyEmmiter = require("./events");

const myEmitter = new MyEmmiter();

myEmitter.on("foo", () => {
    console.log("An event occurred 1.");
});

myEmitter.on("foo", () => {
    console.log("An event occurred 2.");
});

myEmitter.on("foo", (x) => {
    console.log("An event with a parameter occurred");
    console.log(x);
});

// The event will occur only one time...
myEmitter.once("bar", () => {
    console.log("An event occurred bar...");
});

myEmitter.emit("foo");
myEmitter.emit("foo", "some text");

// myEmitter.emit("bar");
// myEmitter.emit("bar");
// myEmitter.emit("bar");
