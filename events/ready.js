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
        let time_update = 1000 * 60 * 60 * 6; //раз в 6 часов поднимает статус

        updateStatus()
        setInterval(updateStatus, time_update)

    if (!logs_channel) return;

    logs_channel.send("Я запущено!");
  }
}
module.exports = (...args) => {
  new Event().execute(...args);
};
