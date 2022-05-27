const { MessageEmbed } = require("discord.js")

class Event {
    constructor() { }

    async execute(bot, mongo) {

        const channel = bot.channels.cache.get("979720305524228106")
        const webhooks = await channel.fetchWebhooks();
        const webhook = webhooks.find(wh => wh.token) ?? await channel.createWebhook(`${channel.name}`)

        process.on("unhandledRejection", async (reason, promise) => {
            const embed = new MessageEmbed()
                .addField("Promise", `\`\`\`${promise}\`\`\``, true)
                .addField("Reason", `\`\`\`${reason}\`\`\``, true)
                .setTimestamp()
                .setColor(`RED`)

            console.log(reason, promise);
            return webhook.send({
                embeds: [embed],
                username: `Anti Crash - ${bot.user.username}`,
                avatarURL: bot.user.displayAvatarURL({ format: 'png' })
            })
        });

        process.on("uncaughtException", async (err, origin) => {
            const embed = new MessageEmbed()
                .addField("Origin", `\`\`\`${origin}\`\`\``, true)
                .addField("Error", `\`\`\`${err}\`\`\``, true)
                .setTimestamp()
                .setColor(`RED`)

            console.log(err, origin);
            return webhook.send({
                embeds: [embed],
                username: `Anti Crash - ${bot.user.username}`,
                avatarURL: bot.user.displayAvatarURL({ format: 'png' })
            })
        });

        process.on("uncaughtExceptionMonitor", async (err, origin) => {
            const embed = new MessageEmbed()
                .addField("Origin", `\`\`\`${origin}\`\`\``, true)
                .addField("Error", `\`\`\`${err}\`\`\``, true)
                .setTimestamp()
                .setColor(`RED`)

            console.log(err, origin);
            return webhook.send({
                embeds: [embed],
                username: `Anti Crash - ${bot.user.username}`,
                avatarURL: bot.user.displayAvatarURL({ format: 'png' })
            })
        });

        process.on("multipleResolves", async (type, promise, reason) => {
            const embed = new MessageEmbed()
                .addField("Type", `\`\`\`${type}\`\`\``, false)
                .addField("Promise", `\`\`\`${promise}\`\`\``, true)
                .addField("Reason", `\`\`\`${reason}\`\`\``, true)
                .setTimestamp()
                .setColor(`RED`)

            console.log(type, promise, reason);
            return webhook.send({
                embeds: [embed],
                username: `Anti Crash - ${bot.user.username}`,
                avatarURL: bot.user.displayAvatarURL({ format: 'png' })
            })
        });
    }
}
module.exports = (...args) => {
    new Event().execute(...args);
};