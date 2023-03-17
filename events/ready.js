class Event {
  constructor() {}

  async execute(bot, mongo, f) {
    let logs_channel = bot.channels.cache.get("802191792820191262");

    function updateStatus() {
    bot.user.setPresence({
            status: 'idle',
            activities: [{
                name: '#SaveRedDeadOnline',
                type: 'WATCHING'
            }]
        });
    }
        let time_update = 1000 * 60 * 60; //раз в час поднимает статус

        updateStatus()
        setInterval(updateStatus, time_update)

    if (!logs_channel) return;

    logs_channel.send("Я завелась <:pepe_Giggle:822331283475791884>");
  }
}
module.exports = (...args) => {
  new Event().execute(...args);
};
