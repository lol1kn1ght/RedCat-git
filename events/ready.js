class Event {
  constructor() {}

  async execute(bot, mongo, f) {
    let logs_channel = bot.channels.cache.get("802191792820191262");

    bot.user.setPresence({
      activities: [{type: "WATCHING", name: "#SaveRedDeadOnline"}],
      status: "idle"
    });

    if (!logs_channel) return;

    logs_channel.send("Я запущено!");
  }
}
module.exports = (...args) => {
  new Event().execute(...args);
};
