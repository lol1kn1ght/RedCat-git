class Event {
  constructor() {}

  async execute(bot, mongo, f) {}
}
module.exports = (...args) => {
  new Event().execute(...args);
};
