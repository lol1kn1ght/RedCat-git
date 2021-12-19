class Event {
  constructor() {}

  async execute(bot, mongo, f) {
    // var fs = require("fs");
    // fs.watch(__dirname, function(event, filename) {
    //   console.log("event is: " + event);
    //   if (filename) {
    //     console.log("filename provided: " + filename);
    //   } else {
    //     console.log("filename not provided");
    //   }
    // });
  }
}
module.exports = (...args) => {
  new Event().execute(...args);
};
