class Event {
  constructor() {}

  async execute(bot, mongo, message) {
    if (!message.author.bot || message.channel.id !== "652538093790035968")
      return;

    message.delete({
      timeout: 15000,
    });
  }
}
module.exports = (...args) => {
  new Event().execute(...args);
};
