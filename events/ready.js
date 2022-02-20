class Event {
  constructor() {}

  async execute(bot, mongo, f) {
    let logs_channel = bot.channels.cache.get("802191792820191262");
  
    bot.user.setPresence({
            status: 'idle',
            activities: [{
                name: '#SaveRedDeadOnline',
                type: 'WATCHING'
            }]
        });

    if (!logs_channel) return;

    logs_channel.send("Я запущено!");
  }
}
module.exports = (...args) => {
  new Event().execute(...args);
};
