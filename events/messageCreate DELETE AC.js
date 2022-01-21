class Event {
  constructor() {}

  async execute(bot, mongo, message) {
    if (message.channel.id !== "652538093790035968") return;

    setTimeout(() => {
      message.delete().catch(err => {});
    }, 15000);
  }
}
module.exports = (...args) => {
  new Event().execute(...args);
};
